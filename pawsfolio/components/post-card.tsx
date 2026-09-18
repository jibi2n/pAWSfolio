import Link from 'next/link'
import type { Build } from '@/lib/types'
import { Avatar, BumpButton, StatusBadge, Tag } from './ui'

export function PostCard({ build }: { build: Build }) {
  return (
    <article className="card-hover relative flex flex-col overflow-hidden animate-fadeinup bg-card rounded-card shadow-[0_8px_24px_rgba(46,26,95,0.08)]">
      <div className="overflow-hidden aspect-[16/10] bg-lavender-bg">
        <img src={build.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <StatusBadge status={build.status} />
        <h3 className="font-medium text-[18px] text-text leading-snug">
          {/* Stretched link: the whole card is clickable, the bump button sits above it. */}
          <Link href={`/builds/${build.id}`} className="after:absolute after:inset-0">
            {build.title}
          </Link>
        </h3>
        <p className="text-[14px] text-subtle leading-relaxed line-clamp-2">{build.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {build.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
        </div>
      </div>
      <div className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={build.author} color={build.avatarColor} size={30} />
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-text truncate">{build.handle}</div>
            <div className="font-mono text-[12px] text-muted">{build.timeAgo}</div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="font-mono flex items-center gap-1 text-[13px] text-muted" aria-label={`${build.comments.length} comments`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            {build.comments.length}
          </div>
          <BumpButton buildId={build.id} bumped={build.bumped} count={build.bumps} />
        </div>
      </div>
    </article>
  )
}

export function PostGrid({ builds }: { builds: Build[] }) {
  return (
    <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {builds.map(b => <PostCard key={b.id} build={b} />)}
    </div>
  )
}
