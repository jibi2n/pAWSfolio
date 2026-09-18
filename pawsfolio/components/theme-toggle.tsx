'use client'

import { useSyncExternalStore } from 'react'

// The theme lives on <html data-theme="purple">. An inline script in layout.tsx sets it before first paint
// (saved choice, else the OS dark-mode setting), so this component only reads and flips it.
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb) } }
const isPurple = () => document.documentElement.dataset.theme === 'purple'

function setPurple(on: boolean) {
  if (on) document.documentElement.dataset.theme = 'purple'
  else delete document.documentElement.dataset.theme
  try { localStorage.setItem('theme', on ? 'purple' : 'light') } catch {} // private mode etc: still works for this visit
  listeners.forEach(cb => cb())
}

export function ThemeToggle() {
  const purple = useSyncExternalStore(subscribe, isPurple, () => false)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={purple}
      aria-label="Purple mode"
      title={purple ? 'Switch to light mode' : 'Switch to purple mode'}
      onClick={() => setPurple(!purple)}
      // Looks are driven by the `purple:` CSS variant (not React state), so the first paint is already right.
      className="relative shrink-0 w-[60px] h-9 rounded-full transition-colors bg-lavender-bg purple:bg-deep-purple"
    >
      <span
        className="absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-[0_2px_6px_rgba(46,26,95,0.25)] transition-transform duration-200 purple:translate-x-6"
        aria-hidden
      >
        {/* moon */}
        <svg className="hidden purple:block" width="16" height="16" viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        {/* sun */}
        <svg className="purple:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="4" fill="#F59E0B" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
      </span>
    </button>
  )
}
