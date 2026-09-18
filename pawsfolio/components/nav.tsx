'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logOut } from '@/app/actions'
import type { PublicUser } from '@/lib/types'
import { Avatar, Logo, btn } from './ui'

const links = [
  { href: '/', label: 'Feed', isActive: (p: string) => p === '/' },
  { href: '/builds/new', label: 'Post a build', isActive: (p: string) => p === '/builds/new' || p.endsWith('/edit') },
  { href: '/me', label: 'My builds', isActive: (p: string) => p === '/me' },
]

const panel = 'absolute right-0 top-14 w-64 p-2 bg-white rounded-2xl shadow-[0_16px_40px_rgba(46,26,95,0.18)] whitespace-normal'
const menuRow = 'block w-full text-left px-3 py-3 rounded-[10px] text-[15px]'

function UserInfo({ user }: { user: PublicUser }) {
  return (
    <div className="px-3 py-2">
      <div className="text-[14px] font-semibold text-text truncate">{user.name}</div>
      <div className="font-mono text-[12px] text-muted truncate">{user.handle}</div>
    </div>
  )
}

function LogOutButton() {
  return (
    <form action={logOut}>
      <button type="submit" className={`${menuRow} text-[#E11D48] hover:bg-[#FEF2F2]`}>Log out</button>
    </form>
  )
}

export function Nav({ user }: { user: PublicUser | null }) {
  const pathname = usePathname()

  return (
    <nav className="fixed z-50 top-3 inset-x-3 lg:inset-x-auto lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:min-w-[720px] lg:max-w-[900px] shadow-purple bg-white rounded-full pl-2 pr-2 lg:px-4 py-2 flex items-center gap-2 whitespace-nowrap">
      <Link href="/" className="mr-auto lg:mr-4" aria-label="builds.log home">
        <Logo />
      </Link>

      {/* ─── Desktop ─── */}
      <div className="hidden lg:flex items-center gap-1 flex-1">
        {links.map(({ href, label, isActive }) => {
          const active = isActive(pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`nav-item px-4 py-2 rounded-full text-[14px] font-medium ${active ? 'active' : 'text-text hover:bg-[#F1F5F9]'}`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {user ? (
        // Native <details> dropdowns need no JS state. key={pathname} closes them after navigating.
        <details key={pathname} className="relative hidden lg:block">
          <summary className="list-none cursor-pointer rounded-full" aria-label="Account menu">
            <Avatar name={user.name} color={user.avatarColor} size={36} />
          </summary>
          <div className={panel}>
            <UserInfo user={user} />
            <div className="h-px bg-lavender-bg my-1" />
            <LogOutButton />
          </div>
        </details>
      ) : (
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-full text-[14px] font-medium text-text hover:bg-[#F1F5F9]">Log in</Link>
          <Link href="/signup" className={btn('secondary', 'sm')}>Sign up</Link>
        </div>
      )}

      {/* ─── Mobile: one menu with links + account ─── */}
      <details key={`m${pathname}`} className="relative lg:hidden">
        <summary className="list-none cursor-pointer flex items-center gap-2 rounded-full p-1" aria-label="Menu">
          {user && <Avatar name={user.name} color={user.avatarColor} size={32} />}
          <span className="w-10 h-10 rounded-full flex items-center justify-center bg-lavender-bg text-deep-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
          </span>
        </summary>
        <div className={panel}>
          {user && <><UserInfo user={user} /><div className="h-px bg-lavender-bg my-1" /></>}
          {links.map(({ href, label, isActive }) => {
            const active = isActive(pathname)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`${menuRow} font-medium ${active ? 'bg-mint text-text' : 'text-text hover:bg-[#F1F5F9]'}`}
              >
                {label}
              </Link>
            )
          })}
          <div className="h-px bg-lavender-bg my-1" />
          {user ? (
            <LogOutButton />
          ) : (
            <div className="flex gap-2 p-1">
              <Link href="/login" className={`${btn('tertiary', 'sm')} flex-1`}>Log in</Link>
              <Link href="/signup" className={`${btn('secondary', 'sm')} flex-1`}>Sign up</Link>
            </div>
          )}
        </div>
      </details>
    </nav>
  )
}
