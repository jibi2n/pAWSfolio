'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logOut } from '@/app/actions'
import type { PublicUser } from '@/lib/types'
import { ThemeToggle } from './theme-toggle'
import { Avatar, Logo, btn } from './ui'

const links = [
  { href: '/', label: 'Feed', isActive: (p: string) => p === '/' },
  { href: '/me', label: 'My Builds', isActive: (p: string) => p === '/me' },
]

const panel = 'absolute right-0 top-14 w-64 p-2 bg-card text-text rounded-2xl shadow-[0_16px_40px_rgba(46,26,95,0.18)] whitespace-normal'
const menuRow = 'block w-full text-left px-3 py-3 rounded-[10px] text-[15px]'

const SKY_PAGES = ['/', '/login', '/signup'] // pages whose top is a purple sky ([data-sky])

/** True while a purple sky is still behind the bar. Only sky pages can be transparent, so a stale
 *  [data-sky] from the page we just left (e.g. login redirecting to a build) can't leave it see-through. */
function useOnSky(pathname: string) {
  const [skyVisible, setSkyVisible] = useState(true)
  useEffect(() => {
    const check = () => {
      const sky = document.querySelector('[data-sky]')
      setSkyVisible(!sky || sky.getBoundingClientRect().bottom > 80)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])
  return SKY_PAGES.includes(pathname) && skyVisible
}

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
      <button type="submit" className={`${menuRow} text-danger hover:bg-danger-soft`}>Log out</button>
    </form>
  )
}

export function Nav({ user }: { user: PublicUser | null }) {
  const pathname = usePathname()
  const onSky = useOnSky(pathname)
  const onForm = pathname === '/builds/new' || pathname.endsWith('/edit')

  const link = (active: boolean) =>
    `relative py-2 font-mono text-[16px] transition-colors after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[3px] after:rounded-full after:bg-mint after:transition-all ${
      active ? 'after:w-6' : 'after:w-0 hover:after:w-2'
    } ${onSky ? (active ? 'text-white' : 'text-white/75 hover:text-white') : active ? 'text-text' : 'text-subtle hover:text-text'}`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 lg:h-20 border-b transition-colors duration-300 ${
        onSky ? 'bg-transparent border-transparent text-white' : 'bg-card/90 backdrop-blur-md border-lavender-bg text-text'
      }`}
    >
      <nav aria-label="Primary" className="h-full px-4 md:px-8 lg:px-12 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3 lg:gap-6 whitespace-nowrap">
        <Link href="/" aria-label="pAWSfolio home" className="justify-self-start">
          <Logo />
        </Link>

        {/* ─── Desktop ─── */}
        <div className="hidden lg:flex items-center gap-12">
          {links.map(({ href, label, isActive }) => {
            const active = isActive(pathname)
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={link(active)}>
                {label}
              </Link>
            )
          })}
        </div>

        <div className="justify-self-end flex items-center gap-3 lg:gap-5">
          <ThemeToggle />

          {user ? (
            // Native <details> dropdowns need no JS state. key={pathname} closes them after navigating.
            <details key={pathname} className="relative hidden lg:block">
              <summary className="list-none cursor-pointer rounded-full" aria-label="Account menu">
                <Avatar name={user.name} color={user.avatarColor} size={42} />
              </summary>
              <div className={panel}>
                <UserInfo user={user} />
                <div className="h-px bg-lavender-bg my-1" />
                <Link href="/me" className={`${menuRow} hover:bg-hover`}>My Builds</Link>
                {!onForm && <Link href="/builds/new" className={`${menuRow} hover:bg-hover`}>+ Post a build</Link>}
                <div className="h-px bg-lavender-bg my-1" />
                <LogOutButton />
              </div>
            </details>
          ) : (
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/login" className={link(pathname === '/login')}>Log in</Link>
              <Link href="/signup" className={link(pathname === '/signup')}>Sign up</Link>
            </div>
          )}


          {/* ─── Mobile: one menu with links + account ─── */}
          <details key={`m${pathname}`} className="relative lg:hidden">
            <summary className="list-none cursor-pointer flex items-center gap-2 rounded-full" aria-label="Menu">
              {user && <Avatar name={user.name} color={user.avatarColor} size={32} />}
              <span className={`w-10 h-10 rounded-full flex items-center justify-center ${onSky ? 'bg-white/15 text-white' : 'bg-lavender-bg text-on-soft'}`}>
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
                    className={`${menuRow} font-mono ${active ? 'text-text font-semibold' : 'text-subtle hover:bg-hover'}`}
                  >
                    {active && <span className="inline-block w-1.5 h-1.5 mr-2 mb-0.5 rounded-full bg-mint" aria-hidden />}
                    {label}
                  </Link>
                )
              })}
              {!onForm && (
                <div className="p-1">
                  <Link href="/builds/new" className={`${btn('primary', 'sm')} w-full`}>+ Post a build</Link>
                </div>
              )}
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
        </div>
      </nav>
    </header>
  )
}
