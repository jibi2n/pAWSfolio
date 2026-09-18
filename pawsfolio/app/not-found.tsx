import Link from 'next/link'
import { MascotCloud, btn } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8">
      <MascotCloud size={160} />
      <h1 className="text-[32px] font-semibold text-text">Lost in the clouds</h1>
      <p className="text-[16px] text-[#64748B]">We couldn&apos;t find that page or build.</p>
      <Link href="/" className={btn('primary')}>Back to feed</Link>
    </div>
  )
}
