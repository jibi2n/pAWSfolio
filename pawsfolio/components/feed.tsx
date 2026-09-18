import Link from 'next/link'
import Form from 'next/form'
import { ALL_TAGS, type Build, type SortMode } from '@/lib/types'
import { PostGrid } from './post-card'
import { EmptyState } from './ui'

const PER_PAGE = 8 // two full rows at 4 columns

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

  const first = (page - 1) * PER_PAGE + 1
  const last = Math.min(page * PER_PAGE, sorted.length)

  // Same side margins as the nav, content aligned left like an editorial section rather than a centred column.
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10 md:py-14" aria-labelledby="feed-title">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
        <div>
          <p className="font-mono text-[12px] font-semibold tracking-[0.15em] uppercase text-link purple:text-mint mb-2">{'// Latest builds'}</p>
          <h2 id="feed-title" className="text-[26px] md:text-[32px] font-semibold text-text leading-tight">What members are building</h2>
          <p className="text-[14px] text-subtle mt-1">
            {filtered.length} {filtered.length === 1 ? 'build' : 'builds'}{q || activeTags.length ? ' match your filters' : ' from the community'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
          <Form action="/" className="relative sm:flex-1 lg:w-[520px] xl:w-[600px] lg:flex-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="search" name="q" defaultValue={q} placeholder="Search builds…" className="input pl-12 !h-13 text-[16px]" aria-label="Search builds (press Enter)" />
            {activeTags.length > 0 && <input type="hidden" name="tags" value={activeTags.join(',')} />}
            {sort === 'bumped' && <input type="hidden" name="sort" value="bumped" />}
          </Form>
          <div className="flex self-start rounded-tag overflow-hidden shrink-0 border border-lavender-bg">
            {(['newest', 'bumped'] as const).map(s => (
              <Link
                key={s}
                href={href({ sort: s === 'bumped' ? s : '' })}
                scroll={false}
                aria-current={sort === s ? 'true' : undefined}
                className={`seg-btn font-mono px-5 h-13 inline-flex items-center text-[13px] font-medium ${sort === s ? 'active' : 'text-subtle bg-card'}`}
              >
                {s === 'newest' ? 'Newest' : 'Most bumped'}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-lavender-bg">
        <span className="hidden md:block font-mono text-[12px] text-muted shrink-0 pt-1.5">Filter by service</span>
        <div className="flex gap-2 min-w-0 flex-1 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            {ALL_TAGS.map(t => {
              const active = activeTags.includes(t)
              const tags = active ? activeTags.filter(x => x !== t) : [...activeTags, t]
              return (
                <Link
                  key={t}
                  href={href({ tags: tags.join(',') })}
                  scroll={false}
                  aria-pressed={active}
                  className={`tag-chip shrink-0 font-mono inline-flex items-center px-3 py-1 rounded-tag text-[13px] ${active ? 'active bg-vibrant-purple text-white' : 'bg-lavender-bg text-link'}`}
                >
                  #{t}
                </Link>
              )
            })}
        </div>
      </div>

      {paginated.length === 0 ? (
        <EmptyState text={builds.length === 0 ? 'No builds yet. Be the first to share what you made.' : 'No builds match that search.'} />
      ) : (
        <>
          <PostGrid builds={paginated} />
          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 md:mt-12">
            <p className="font-mono text-[13px] text-muted">Showing {first}–{last} of {sorted.length}</p>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} href={p => href({ page: p > 1 ? String(p) : '' })} />}
          </div>
        </>
      )}
    </section>
  )
}

function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (p: number) => string }) {
  const edge = 'px-4 py-2 rounded-tag text-[14px] font-medium bg-lavender-bg text-on-soft'
  const disabled = 'opacity-40 pointer-events-none'
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      <Link href={href(page - 1)} aria-disabled={page === 1} className={`${edge} ${page === 1 ? disabled : ''}`}>← Prev</Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <Link
          key={p}
          href={href(p)}
          aria-current={page === p ? 'page' : undefined}
          className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-[14px] font-semibold ${page === p ? 'bg-deep-purple text-white' : 'bg-card text-subtle'}`}
        >
          {p}
        </Link>
      ))}
      <Link href={href(page + 1)} aria-disabled={page === totalPages} className={`${edge} ${page === totalPages ? disabled : ''}`}>Next →</Link>
    </nav>
  )
}
