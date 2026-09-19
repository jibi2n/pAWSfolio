// Small shared pieces: buttons, avatar, badges, tags, logo, clouds.
import Link from 'next/link'
import { toggleBump } from '@/app/actions'
import type { Status } from '@/lib/types'

// ─── Buttons ──────────────────────────────────────────────────────────────────

const variants = {
  primary: 'bg-mint text-ink shadow-mint-glow',
  secondary: 'bg-deep-purple text-white',
  tertiary: 'bg-lavender-bg text-on-soft',
  danger: 'bg-card text-danger border border-[#F43F5E]',
}
const sizes = {
  md: 'min-h-12 px-7 text-[15px]',
  sm: 'min-h-10 px-4 text-[14px]',
}

export function btn(variant: keyof typeof variants, size: keyof typeof sizes = 'md') {
  return `inline-flex items-center justify-center gap-2 rounded-btn font-mono font-medium disabled:opacity-40 ${variants[variant]} ${sizes[size]}`
}

// ─── Clouds & logo ────────────────────────────────────────────────────────────

export function CloudFace({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 80 52" fill="none" className={className}>
      <ellipse cx="40" cy="32" rx="36" ry="20" fill="white" />
      <ellipse cx="24" cy="26" rx="16" ry="16" fill="white" />
      <ellipse cx="56" cy="24" rx="18" ry="18" fill="white" />
      <ellipse cx="40" cy="20" rx="22" ry="18" fill="white" />
      <circle cx="30" cy="30" r="3" fill="#2E1A5F" />
      <circle cx="50" cy="30" r="3" fill="#2E1A5F" />
      <line x1="35" y1="36" x2="45" y2="36" stroke="#2E1A5F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function MascotCloud({ size = 120 }: { size?: number }) {
  const h = size * 0.7
  return (
    <div className="relative inline-flex items-center justify-center animate-float" style={{ width: size, height: h }}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(192,132,252,0.25)', filter: `blur(${size * 0.2}px)`, transform: 'scale(0.8) translateY(10%)' }} />
      <svg width={size} height={h} viewBox="0 0 120 84" fill="none" className="relative z-10">
        <ellipse cx="60" cy="54" rx="54" ry="30" fill="white" />
        <ellipse cx="36" cy="42" rx="24" ry="24" fill="white" />
        <ellipse cx="84" cy="38" rx="27" ry="27" fill="white" />
        <ellipse cx="60" cy="32" rx="33" ry="27" fill="white" />
        <circle cx="48" cy="54" r="4.5" fill="#2E1A5F" />
        <circle cx="72" cy="54" r="4.5" fill="#2E1A5F" />
        <path d="M54 63 Q60 68 66 63" stroke="#2E1A5F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

/** Cloud tile + "pAWSfolio" wordmark. The text takes the nav's colour (white on the sky, dark on the solid bar). */
export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-[10px] lg:rounded-xl shrink-0 bg-vibrant-purple w-9 h-9 lg:w-11 lg:h-11">
        <CloudFace size={30} />
      </div>
      {/* Below lg the subtitle drops to its own small line so the nav controls fit on phones */}
      <span className="font-bold text-[17px] lg:text-[21px] tracking-tight max-lg:leading-tight">
        pAWSfolio
        <span className="max-lg:block max-lg:font-mono max-lg:text-[10px] max-lg:font-medium max-lg:uppercase max-lg:tracking-[0.14em] max-lg:opacity-75">
          <span className="max-lg:hidden"> - </span>AWS Builders UST
        </span>
      </span>
    </div>
  )
}

// ─── People & labels ──────────────────────────────────────────────────────────

export function Avatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
    </div>
  )
}

const statusStyles: Record<Status, { label: string; background: string; color: string }> = {
  live: { label: 'Live', background: 'var(--color-live-soft)', color: 'var(--color-live)' },
  'in-progress': { label: 'In progress', background: 'var(--color-lavender-bg)', color: 'var(--color-link)' },
  archived: { label: 'Archived', background: 'var(--color-hover)', color: 'var(--color-subtle)' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, ...style } = statusStyles[status]
  return (
    <span className="font-mono inline-flex self-start items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold" style={style}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.color }} aria-hidden />
      {label}
    </span>
  )
}

export function Tag({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  const className = `tag-chip font-mono inline-flex items-center px-3 py-1 rounded-tag text-[13px] ${active ? 'active bg-vibrant-purple text-white' : 'bg-lavender-bg text-link'}`
  if (!onClick) return <span className={className}>#{label}</span>
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={className}>
      #{label}
    </button>
  )
}

/** A tiny form around the server action, so bumping works even before JS loads. Guests get sent to /login. */
export function BumpButton({ buildId, bumped, count, large }: { buildId: string; bumped: boolean; count: number; large?: boolean }) {
  return (
    <form action={toggleBump.bind(null, buildId)}>
      <button
        type="submit"
        aria-pressed={bumped}
        className={`bump-btn font-mono inline-flex items-center gap-2 rounded-btn font-medium ${bumped ? 'bumped' : 'bg-lavender-bg text-link'} ${large ? 'px-6 py-3 text-[16px] min-h-12' : 'px-3 py-1.5 text-[13px] min-h-9'}`}
      >
        {/* Outline thumbs-up in the button's text colour (filled once bumped) */}
        <svg width={large ? 18 : 15} height={large ? 18 : 15} viewBox="0 0 24 24" fill={bumped ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /></svg>
        Bump {count > 0 && <span>({count})</span>}
      </button>
    </form>
  )
}

// ─── States ───────────────────────────────────────────────────────────────────

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <MascotCloud size={140} />
      <p className="text-[20px] font-medium text-text text-center max-w-xs">{text}</p>
      <Link href="/builds/new" className={btn('primary')}>Post a build</Link>
    </div>
  )
}
