import Link from 'next/link'
import type { Build, PublicUser } from '@/lib/types'
import { Avatar, BumpButton, MascotCloud, StatusBadge, Tag } from './ui'
import { Comments } from './comments'
import { OwnerActions } from './owner-actions'

export function BuildDetail({ build, user, isNew }: { build: Build; user: PublicUser | null; isNew: boolean }) {
  return (
    <div className="max-w-[800px] mx-auto px-8 pt-28 pb-20">
      {isNew && (
        <div className="flex items-center gap-4 p-5 mb-6 rounded-card bg-white shadow-purple" role="status">
          <MascotCloud size={64} />
          <div>
            <p className="text-[18px] font-semibold text-text">Your build is live! ☁️</p>
            <p className="text-[14px] text-[#64748B]">Time to share it with the world.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 text-[14px] text-vibrant-purple font-medium hover:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to feed
        </Link>
        {user?.id === build.authorId && <OwnerActions buildId={build.id} />}
      </div>

      <div className="overflow-hidden mb-8 rounded-card aspect-video bg-lavender-bg">
        <img src={build.imageUrl} alt={build.title} className="w-full h-full object-cover" />
      </div>

      <StatusBadge status={build.status} />
      <h1 className="text-[32px] font-semibold text-text mt-3 mb-4 leading-tight">{build.title}</h1>

      <div className="flex items-center gap-3 mb-6">
        <Avatar name={build.author} color={build.avatarColor} size={40} />
        <div>
          <div className="text-[15px] font-semibold text-text">{build.author}</div>
          <div className="font-mono text-[13px] text-muted">{build.handle} · {build.postedAt}</div>
        </div>
      </div>

      {build.link && (
        <a href={build.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-[16px] mb-6 bg-white border border-lavender-bg hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-lavender-bg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[13px] text-muted font-medium mb-0.5">LINK</div>
            <div className="text-[14px] text-vibrant-purple font-medium truncate">{build.link}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
        </a>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {build.tags.map(t => <Tag key={t} label={t} />)}
      </div>

      <div className="mb-8">
        {build.description.split('\n').map((p, i) => (
          <p key={i} className="text-[16px] text-text leading-relaxed mb-4">{p}</p>
        ))}
      </div>

      <div className="flex items-center justify-center mb-12">
        <BumpButton buildId={build.id} bumped={build.bumped} count={build.bumps} large />
      </div>

      <div className="h-px bg-lavender-bg mb-8" />

      <Comments build={build} user={user} />
    </div>
  )
}
