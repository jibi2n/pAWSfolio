// JSON-file "database". data/db.json is created from data/seed.json on first read; delete it to reset.
// ponytail: whole-file read/write with no locking, last write wins. Fine for a demo; swap for SQLite if it gets real traffic.
import fs from 'node:fs'
import path from 'node:path'
import type { Build, BuildRecord, Db, PublicUser, User } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const SEED_FILE = path.join(DATA_DIR, 'seed.json')
// Spelled out (not built from a variable) so Next's file tracing stays scoped to data/uploads.
export const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads')
export const uploadPath = (name: string) => path.join(process.cwd(), 'data', 'uploads', path.basename(name))

export function readDb(): Db {
  if (!fs.existsSync(DB_FILE)) fs.copyFileSync(SEED_FILE, DB_FILE)
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

export function writeDb(db: Db) {
  // Write then rename, so a crash mid-write can't leave half a JSON file.
  fs.writeFileSync(DB_FILE + '.tmp', JSON.stringify(db, null, 2))
  fs.renameSync(DB_FILE + '.tmp', DB_FILE)
}

export const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const toPublicUser = ({ id, name, handle, avatarColor }: User): PublicUser => ({ id, name, handle, avatarColor })

// ─── Read helpers (join authors, compute counts and dates) ────────────────────

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toView(b: BuildRecord, db: Db, viewerId?: string): Build {
  const unknown = { name: 'Deleted user', handle: '@deleted', avatarColor: '#94A3B8' }
  const userOf = (id: string) => db.users.find(u => u.id === id) ?? unknown
  const author = userOf(b.authorId)
  return {
    id: b.id,
    title: b.title,
    description: b.description,
    imageUrl: b.imageUrl,
    link: b.link,
    status: b.status,
    tags: b.tags,
    authorId: b.authorId,
    author: author.name,
    handle: author.handle,
    avatarColor: author.avatarColor,
    postedAt: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeAgo: timeAgo(b.createdAt),
    bumps: b.bumpedBy.length,
    bumped: !!viewerId && b.bumpedBy.includes(viewerId),
    comments: b.comments.map(c => {
      const u = userOf(c.authorId)
      return { id: c.id, authorId: c.authorId, author: u.name, handle: u.handle, avatarColor: u.avatarColor, timeAgo: timeAgo(c.createdAt), text: c.text }
    }),
  }
}

/** Newest first. */
export function getBuilds(viewerId?: string): Build[] {
  const db = readDb()
  return [...db.builds]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map(b => toView(b, db, viewerId))
}

export function getBuild(id: string, viewerId?: string): Build | undefined {
  const db = readDb()
  const b = db.builds.find(b => b.id === id)
  return b && toView(b, db, viewerId)
}
