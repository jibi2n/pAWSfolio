import fs from 'node:fs'
import { uploadPath } from '@/lib/db'

// Uploaded images live in data/uploads/ (outside public/, which Next only serves as of build time).
const TYPES: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }

export async function GET(_: Request, { params }: RouteContext<'/uploads/[name]'>) {
  const { name } = await params
  const ext = /^[\w-]+\.(png|jpg|gif|webp)$/.exec(name)?.[1] // also blocks ../ tricks
  const file = uploadPath(name)
  if (!ext || !fs.existsSync(file)) return new Response('Not found', { status: 404 })
  return new Response(fs.readFileSync(file), {
    headers: { 'Content-Type': TYPES[ext], 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
