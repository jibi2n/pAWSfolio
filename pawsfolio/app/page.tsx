import Link from 'next/link'
import { Feed } from '@/components/feed'
import { HeroClouds } from '@/components/hero-clouds'
import { Mascot } from '@/components/mascot'
import { Starfield } from '@/components/starfield'
import { getCurrentUser } from '@/lib/auth'
import { getBuilds } from '@/lib/db'
import { btn } from '@/components/ui'

export default async function FeedPage({ searchParams }: PageProps<'/'>) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()])
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  return (
    <>
      <Hero />
      <Feed builds={getBuilds(user?.id)} params={{ q: str(params.q), tags: str(params.tags), sort: str(params.sort), page: str(params.page) }} />
    </>
  )
}

function Hero() {
  return (
    <div className="hero-gradient grain-overlay relative overflow-hidden min-h-[420px] sm:min-h-[480px] pt-[104px] sm:pt-[120px]">
      <Starfield />
      {/* Vignette: darkens gently toward the edges, keeping the mascot area brightest */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_75%_85%_at_50%_32%,transparent_35%,rgba(30,17,69,0.95)_100%)]" aria-hidden />

      <HeroClouds />


      <div className="relative z-20 max-w-4xl mx-auto px-5 sm:px-8 pb-20 text-center">
        <Mascot />
        <h1 className="font-hand text-[44px] sm:text-[72px] leading-tight text-white mb-5">What&apos;s in the Clouds?</h1>
        <p className="text-[15px] sm:text-[17px] text-white/80 max-w-lg mx-auto leading-relaxed mb-8">
          See what fellow builders are making with AWS. Share yours, bump the ones you love.
        </p>
        <Link href="/builds/new" className={btn('primary')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Post a build
        </Link>
      </div>
    </div>
  )
}
