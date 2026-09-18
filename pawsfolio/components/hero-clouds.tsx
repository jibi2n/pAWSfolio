'use client'

import { useEffect, useRef } from 'react'

// Vanta CLOUDS: a WebGL shader of soft volumetric clouds that drift and follow the pointer (mouse or touch).
// It sits between a purple gradient and the content on top. `mix-blend-screen` drops the dark sky out, so only
// the bright, cottony clouds show over the purple, and the layer's opacity keeps them see-through.
export function HeroClouds() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect reduced motion: the static gradient and SVG clouds stay as they are.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let effect: { destroy: () => void } | undefined
    let cancelled = false

    // Load three + vanta only in the browser, and only on pages that use this (feed hero, login, signup).
    Promise.all([import('three'), import('vanta/dist/vanta.clouds.min')])
      .then(([THREE, vanta]) => {
        if (cancelled || !ref.current) return
        effect = vanta.default({
          el: ref.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 0x1e1145,
          skyColor: 0x2e1a5f, // dark: disappears under mix-blend-screen
          cloudColor: 0xe9d5ff, // lavender-white puffs
          cloudShadowColor: 0x4a2080,
          sunColor: 0xc084fc,
          sunGlareColor: 0x7c3aed,
          sunlightColor: 0xc084fc,
          speed: 0.8,
        })
      })
      .catch(() => {}) // no WebGL: the hero still has its gradient and SVG clouds

    return () => {
      cancelled = true
      effect?.destroy()
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 z-0 opacity-50 mix-blend-screen pointer-events-none" aria-hidden />
}
