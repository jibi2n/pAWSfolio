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

export function Nav({ user }: { user: PublicUser | null }) {
  const pathname = usePathname()
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 shadow-purple bg-white rounded-full px-4 py-2 flex items-center gap-2 min-w-[720px] max-w-[900px] whitespace-nowrap">
      <Link href="/" className="mr-4" aria-label="builds.log home">
        <Logo />
      </Link>
      <div className="flex items-center gap-1 flex-1">
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
        // Native <details> dropdown: no JS state needed.
        <details className="relative">
          <summary className="list-none cursor-pointer rounded-full" aria-label="Account menu">
            <Avatar name={user.name} color={user.avatarColor} size={36} />
          </summary>
          <div className="absolute right-0 top-12 w-56 p-2 bg-white rounded-[16px] shadow-[0_16px_40px_rgba(46,26,95,0.18)]">
            <div className="px-3 py-2">
              <div className="text-[14px] font-semibold text-text truncate">{user.name}</div>
              <div className="font-mono text-[12px] text-muted truncate">{user.handle}</div>
            </div>
            <div className="h-px bg-lavender-bg my-1" />
            <form action={logOut}>
              <button type="submit" className="w-full text-left px-3 py-2 rounded-[10px] text-[14px] text-[#E11D48] hover:bg-[#FEF2F2]">
                Log out
              </button>
            </form>
          </div>
        </details>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-full text-[14px] font-medium text-text hover:bg-[#F1F5F9]">Log in</Link>
          <Link href="/signup" className={btn('secondary', 'sm')}>Sign up</Link>
        </div>
      )}
    </nav>
  )
}
