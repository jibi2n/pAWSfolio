import Link from 'next/link'
import Form from 'next/form'
import { ALL_TAGS, type Build, type SortMode } from '@/lib/types'
import { PostGrid } from './post-card'
import { EmptyState } from './ui'

const PER_PAGE = 6

export type FeedParams = { q?: string; tags?: string; sort?: string; page?: string }

/**
 * Server-rendered feed. Filters, sort and page live in the URL (/?q=lambda&tags=S3,Lambda&sort=bumped&page=2),
 * so chips and pagination are plain links and only one page of builds is sent to the browser.
 */
export function Feed({ builds, params }: { builds: Build[]; params: FeedParams }) {
  const q = params.q?.trim() ?? ''
  const activeTags = params.tags?.split(',').filter(Boolean) ?? []
  const sort: SortMode = params.sort === 'bumped' ? 'bumped' : 'newest'

  // Build a feed URL from the current params plus changes. Any filter change drops back to page 1.
  function href(next: Partial<Record<'q' | 'tags' | 'sort' | 'page', string>>) {
    const sp = new URLSearchParams()
    const merged = { q, tags: activeTags.join(','), sort: sort === 'bumped' ? 'bumped' : '', page: '', ...next }
    for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v)
    const qs = sp.toString()
    return qs ? `/?${qs}` : '/'
  }

  const needle = q.toLowerCase()
  const filtered = builds.filter(b =>
    (!needle || b.title.toLowerCase().includes(needle) || b.description.toLowerCase().includes(needle)) &&
    activeTags.every(t => b.tags.includes(t)),
  )
  const sorted = sort === 'bumped' ? [...filtered].sort((a, b) => b.bumps - a.bumps) : filtered // already newest-first
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const page = Math.min(totalPages, Math.max(1, Number(params.page) || 1))
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <Form action="/" className="relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="search" name="q" defaultValue={q} placeholder="Search builds... (press Enter)" className="input pl-11" aria-label="Search builds" />
          {activeTags.length > 0 && <input type="hidden" name="tags" value={activeTags.join(',')} />}
          {sort === 'bumped' && <input type="hidden" name="sort" value="bumped" />}
        </Form>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2 flex-1">
            {ALL_TAGS.map(t => {
              const active = activeTags.includes(t)
              const tags = active ? activeTags.filter(x => x !== t) : [...activeTags, t]
              return (
                <Link
                  key={t}
                  href={href({ tags: tags.join(',') })}
                  scroll={false}
                  aria-pressed={active}
                  className={`tag-chip font-mono inline-flex items-center px-3 py-1 rounded-tag text-[13px] ${active ? 'active bg-vibrant-purple text-white' : 'bg-lavender-bg text-vibrant-purple'}`}
                >
                  #{t}
                </Link>
              )
            })}
          </div>
          <div className="flex rounded-tag overflow-hidden shrink-0 border border-lavender-bg">
            {(['newest', 'bumped'] as const).map(s => (
              <Link
                key={s}
                href={href({ sort: s === 'bumped' ? s : '' })}
                scroll={false}
                aria-current={sort === s ? 'true' : undefined}
                className={`seg-btn font-mono px-4 py-2 text-[13px] font-medium ${sort === s ? 'active' : 'text-[#64748B] bg-white'}`}
              >
                {s === 'newest' ? 'Newest' : 'Most bumped'}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {paginated.length === 0 ? (
        <EmptyState text={builds.length === 0 ? 'No builds yet. Be the first to share what you made.' : 'No builds match that search.'} />
      ) : (
        <>
          <PostGrid builds={paginated} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} href={p => href({ page: p > 1 ? String(p) : '' })} />}
        </>
      )}
    </div>
  )
}

function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (p: number) => string }) {
  const edge = 'px-4 py-2 rounded-tag text-[14px] font-medium bg-lavender-bg text-deep-purple'
  const disabled = 'opacity-40 pointer-events-none'
  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <Link href={href(page - 1)} aria-disabled={page === 1} className={`${edge} ${page === 1 ? disabled : ''}`}>← Prev</Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <Link
          key={p}
          href={href(p)}
          aria-current={page === p ? 'page' : undefined}
          className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-[14px] font-semibold ${page === p ? 'bg-deep-purple text-white' : 'bg-white text-[#64748B]'}`}
        >
          {p}
        </Link>
      ))}
      <Link href={href(page + 1)} aria-disabled={page === totalPages} className={`${edge} ${page === totalPages ? disabled : ''}`}>Next →</Link>
    </nav>
  )
}
