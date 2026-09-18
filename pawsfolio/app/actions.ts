'use server'

// Every mutation lives here. Each one re-checks who's asking; hidden buttons in the UI are not security.
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UPLOADS_DIR, newId, readDb, uploadPath, writeDb } from '@/lib/db'
import { endSession, requireUser, safeNext, startSession } from '@/lib/auth'
import type { Status } from '@/lib/types'

const AVATAR_COLORS = ['#7C3AED', '#4ADEB8', '#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#F97316', '#8B5CF6']
const IMAGE_TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' }
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const STATUSES: Status[] = ['live', 'in-progress', 'archived']

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type AuthState = { error?: string; values?: Record<string, string> }

export async function signUp(_: AuthState, fd: FormData): Promise<AuthState> {
  const name = str(fd, 'name')
  const handle = str(fd, 'handle').replace(/^@/, '').toLowerCase()
  const email = str(fd, 'email').toLowerCase()
  const password = String(fd.get('password') ?? '')
  const values = { name, handle, email }

  if (!name || !handle || !email || !password) return { error: 'Fill in every field.', values }
  if (!/^[a-z0-9_]{3,20}$/.test(handle)) return { error: 'Handles are 3-20 letters, numbers, or underscores.', values }
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "That email doesn't look right.", values }
  if (password.length < 6) return { error: 'Use at least 6 characters for your password.', values }

  const db = readDb()
  if (db.users.some(u => u.email === email)) return { error: 'That email already has an account. Try logging in.', values }
  if (db.users.some(u => u.handle === `@${handle}`)) return { error: `@${handle} is taken. Pick another handle.`, values }

  const id = newId('u')
  db.users.push({ id, name, handle: `@${handle}`, email, password, avatarColor: AVATAR_COLORS[db.users.length % AVATAR_COLORS.length] })
  writeDb(db)
  await startSession(id)
  redirect(safeNext(str(fd, 'next')))
}

export async function logIn(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = str(fd, 'email').toLowerCase()
  const password = String(fd.get('password') ?? '')
  const user = readDb().users.find(u => u.email === email && u.password === password)
  if (!user) return { error: "Email or password doesn't match.", values: { email } }
  await startSession(user.id)
  redirect(safeNext(str(fd, 'next')))
}

export async function logOut() {
  await endSession()
  redirect('/')
}

// ─── Builds ───────────────────────────────────────────────────────────────────

export type BuildFormState = { errors?: { title?: string; description?: string; image?: string; link?: string } }

async function saveUpload(file: File) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  const name = `${randomUUID()}.${IMAGE_TYPES[file.type]}` // never trust the uploader's filename
  fs.writeFileSync(uploadPath(name), Buffer.from(await file.arrayBuffer()))
  return `/uploads/${name}`
}

function removeUpload(imageUrl: string) {
  if (!imageUrl.startsWith('/uploads/')) return // seed images are external URLs
  fs.rmSync(uploadPath(imageUrl), { force: true })
}

/** Create when there's no `id` in the form, otherwise update (owner only). */
export async function saveBuild(_: BuildFormState, fd: FormData): Promise<BuildFormState> {
  const id = str(fd, 'id')
  const user = await requireUser(id ? `/builds/${id}/edit` : '/builds/new')
  const db = readDb()
  const existing = id ? db.builds.find(b => b.id === id) : undefined
  if (id && existing?.authorId !== user.id) redirect('/')

  const title = str(fd, 'title')
  const description = str(fd, 'description')
  const link = str(fd, 'link')
  const status = STATUSES.includes(str(fd, 'status') as Status) ? (str(fd, 'status') as Status) : 'live'
  const tags = fd.getAll('tags').map(String)
  const file = fd.get('image')
  const hasFile = file instanceof File && file.size > 0

  const errors: NonNullable<BuildFormState['errors']> = {}
  if (!title) errors.title = 'Give your build a title'
  if (!description) errors.description = 'Tell us a bit about what you built'
  if (link && !/^https?:\/\/\S+$/i.test(link)) errors.link = 'Links start with http:// or https://' // also blocks javascript: links
  if (hasFile && !IMAGE_TYPES[file.type]) errors.image = 'Use a PNG, JPG, GIF, or WebP'
  else if (hasFile && file.size > MAX_IMAGE_BYTES) errors.image = 'Keep images under 10MB'
  else if (!hasFile && !existing) errors.image = 'Add an image or GIF of your build'
  if (Object.keys(errors).length) return { errors }

  const fields = { title, description, status, tags, link: link || undefined }

  if (existing) {
    if (hasFile) {
      removeUpload(existing.imageUrl)
      existing.imageUrl = await saveUpload(file)
    }
    Object.assign(existing, fields)
    writeDb(db)
    revalidatePath('/', 'layout')
    redirect(`/builds/${existing.id}`)
  }

  const newBuild = {
    ...fields,
    id: newId('b'),
    authorId: user.id,
    imageUrl: await saveUpload(file as File),
    createdAt: new Date().toISOString(),
    bumpedBy: [],
    comments: [],
  }
  db.builds.push(newBuild)
  writeDb(db)
  revalidatePath('/', 'layout')
  redirect(`/builds/${newBuild.id}?new=1`)
}

export async function deleteBuild(id: string) {
  const user = await requireUser(`/builds/${id}`)
  const db = readDb()
  const build = db.builds.find(b => b.id === id)
  if (!build || build.authorId !== user.id) return
  db.builds = db.builds.filter(b => b.id !== id) // comments live inside the build, so they go too
  writeDb(db)
  removeUpload(build.imageUrl)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function toggleBump(id: string) {
  const user = await requireUser(`/builds/${id}`)
  const db = readDb()
  const build = db.builds.find(b => b.id === id)
  if (!build) return
  build.bumpedBy = build.bumpedBy.includes(user.id) ? build.bumpedBy.filter(u => u !== user.id) : [...build.bumpedBy, user.id]
  writeDb(db)
  revalidatePath('/', 'layout')
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function addComment(buildId: string, fd: FormData) {
  const user = await requireUser(`/builds/${buildId}`)
  const text = str(fd, 'text')
  const db = readDb()
  const build = db.builds.find(b => b.id === buildId)
  if (!build || !text) return
  build.comments.push({ id: newId('c'), authorId: user.id, text, createdAt: new Date().toISOString() })
  writeDb(db)
  revalidatePath(`/builds/${buildId}`)
}

/** The commenter or the build's owner can delete a comment. */
export async function deleteComment(buildId: string, commentId: string) {
  const user = await requireUser(`/builds/${buildId}`)
  const db = readDb()
  const build = db.builds.find(b => b.id === buildId)
  const comment = build?.comments.find(c => c.id === commentId)
  if (!build || !comment || (comment.authorId !== user.id && build.authorId !== user.id)) return
  build.comments = build.comments.filter(c => c.id !== commentId)
  writeDb(db)
  revalidatePath(`/builds/${buildId}`)
}
