'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { logIn, signUp, type AuthState } from '@/app/actions'
import { CloudBg, CloudFace, btn } from './ui'

const FIELDS = {
  login: [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@ust.edu.ph', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'current-password' },
  ],
  signup: [
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'Juan Dela Cruz', autoComplete: 'name' },
    { name: 'handle', label: 'Handle', type: 'text', placeholder: 'juandc', autoComplete: 'username' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@ust.edu.ph', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', autoComplete: 'new-password' },
  ],
}

const COPY = {
  login: { title: 'Welcome back, builder', sub: 'Log in to post builds, comment, and bump.', submit: 'Log in', pending: 'Logging in...', alt: "Don't have an account?", altLink: 'Sign up', altHref: '/signup' },
  signup: { title: 'Join the builders', sub: 'Share what you make with AWS Builders - UST.', submit: 'Create account', pending: 'Creating account...', alt: 'Already have an account?', altLink: 'Log in', altHref: '/login' },
}

export function AuthForm({ mode, next }: { mode: 'login' | 'signup'; next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === 'login' ? logIn : signUp, {})
  const copy = COPY[mode]
  const nextQs = next !== '/' ? `?next=${encodeURIComponent(next)}` : ''

  return (
    <div className="hero-gradient grain-overlay relative overflow-hidden min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="absolute bottom-0 left-0 right-0 h-[160px] pointer-events-none" aria-hidden>
        <CloudBg className="absolute bottom-0 left-[-10%] w-[60%] opacity-60" />
        <CloudBg className="absolute bottom-0 right-[-5%] w-[55%] opacity-50" />
      </div>

      <div className="relative z-20 w-full max-w-[440px] p-10 bg-white rounded-hero shadow-[0_24px_64px_rgba(46,26,95,0.35)]">
        <div className="flex items-center justify-center rounded-btn bg-vibrant-purple w-14 h-14 mb-6">
          <CloudFace size={40} />
        </div>
        <h1 className="text-[28px] font-semibold text-text leading-tight mb-1">{copy.title}</h1>
        <p className="text-[15px] text-[#64748B] mb-6">{copy.sub}</p>

        <div className="flex gap-3 p-4 mb-6 rounded-btn bg-[#FEF3C7] text-[13px] text-[#78350F] leading-relaxed" role="note">
          <span aria-hidden>⚠️</span>
          <p>
            Since this is an MVP, please note that passwords are <strong>not hashed yet</strong>. Don&apos;t reuse a real password.
            {mode === 'login' && <> Demo account: <span className="font-mono">mariasantos@ust.edu.ph</span> / <span className="font-mono">password123</span></>}
          </p>
        </div>

        {/* key: remount with the returned values after an error, since React resets the form after an action. */}
        <form key={JSON.stringify(state.values)} action={action} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          {FIELDS[mode].map(({ label, ...f }) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label htmlFor={f.name} className="text-[14px] font-semibold text-text">{label}</label>
              <input id={f.name} {...f} required defaultValue={state.values?.[f.name]} className="input" aria-invalid={!!state.error} />
            </div>
          ))}
          {state.error && <p className="text-[13px] text-[#E11D48]" role="alert">{state.error}</p>}
          <button type="submit" disabled={pending} className={`${btn('primary')} mt-2`}>
            {pending ? copy.pending : copy.submit}
          </button>
        </form>

        <p className="text-[14px] text-[#64748B] text-center mt-6">
          {copy.alt} <Link href={copy.altHref + nextQs} className="text-vibrant-purple font-medium">{copy.altLink}</Link>
        </p>
      </div>
    </div>
  )
}
