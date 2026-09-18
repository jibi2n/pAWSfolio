// Cookie sessions backed by data/db.json. The cookie holds a random token, never the user id.
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readDb, toPublicUser, writeDb } from './db'
import type { PublicUser } from './types'

const COOKIE = 'session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days, in seconds

/** Only follow same-site relative paths after login ("//evil.com" is protocol-relative, so reject it). */
export const safeNext = (next: unknown) => (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/')

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const db = readDb()
  const session = db.sessions.find(s => s.token === token && s.expiresAt > Date.now())
  const user = session && db.users.find(u => u.id === session.userId)
  return user ? toPublicUser(user) : null
}

/** For pages and actions that need a logged-in user. Sends guests to /login and back afterwards. */
export async function requireUser(next = '/'): Promise<PublicUser> {
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`)
  return user
}

// Only callable from server actions (cookies can't be set while rendering).
export async function startSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const db = readDb()
  db.sessions = db.sessions.filter(s => s.expiresAt > Date.now()) // drop expired while we're here
  db.sessions.push({ token, userId, expiresAt: Date.now() + MAX_AGE * 1000 })
  writeDb(db)
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function endSession() {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (token) {
    const db = readDb()
    db.sessions = db.sessions.filter(s => s.token !== token)
    writeDb(db)
  }
  store.delete(COOKIE)
}
