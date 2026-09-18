'use client'

import { useEffect, useRef, useState } from 'react'

// The AWS Builders - UST cloud mascot, recreated from the org site's hero: a white cloud whose face slides
// toward the cursor, and whose mouth smiles while you hover something clickable.
// Shape and face use the same 2380-unit coordinates as the original artwork.
const CLOUD = 'M 470 1821 A 415 415 0 0 1 375 1023 A 268 268 0 0 1 809 819 A 553 553 0 0 1 1862 1059 A 400 400 0 0 1 1827 1821 Z'
const NEUTRAL = 'M 918 1190 Q 1168 1190 1418 1190'
const SMILE = 'M 910 1158 Q 1168 1420 1428 1158'
const FACE = 'rgb(93 55 166)'
const VIEWBOX = '60 440 2180 1440' // cropped to the cloud

export function Mascot() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const [smiling, setSmiling] = useState(false)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const current = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let frame: number | null = null

    // Ease the face toward the target each frame; stop once it has settled.
    function tick() {
      current.x += (target.x - current.x) * 0.16
      current.y += (target.y - current.y) * 0.16
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1
      if (settled) Object.assign(current, target)
      faceRef.current?.setAttribute('transform', `translate(${current.x} ${current.y})`)
      frame = settled ? null : requestAnimationFrame(tick)
    }
    const queue = () => { frame ??= requestAnimationFrame(tick) }

    function onMove(e: PointerEvent) {
      setSmiling(e.pointerType !== 'touch' && e.target instanceof Element && !!e.target.closest('a[href], button, summary, input, textarea, [role="switch"]'))
      const box = wrapRef.current?.getBoundingClientRect()
      if (!box || e.pointerType === 'touch') return
      const clamp = (n: number) => Math.max(-1, Math.min(1, n))
      const h = clamp((e.clientX - (box.left + box.width / 2)) / (box.width / 2))
      const v = clamp((e.clientY - (box.top + box.height / 2)) / (box.height / 2))
      // Limits in viewBox units: roomier sideways and downward than upward, like the original.
      target.x = h * 170
      target.y = v < 0 ? v * 100 : v * 230
      queue()
    }
    function reset() {
      setSmiling(false)
      target.x = 0
      target.y = 0
      queue()
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative mx-auto mb-4 w-[clamp(200px,34vw,360px)] animate-float" aria-hidden>
      <div className="absolute inset-[10%] rounded-full bg-lavender/40 blur-3xl" />
      <svg viewBox={VIEWBOX} className="relative w-full h-auto overflow-visible drop-shadow-[0_18px_40px_rgba(46,26,95,0.35)]">
        <path d={CLOUD} fill="white" />
        <g ref={faceRef}>
          <circle cx="683" cy="1191" r="51" fill={FACE} />
          <circle cx="1696" cy="1191" r="51" fill={FACE} />
          <path d={smiling ? SMILE : NEUTRAL} fill="none" stroke={FACE} strokeLinecap="round" strokeWidth="100" className="transition-[d] duration-300" />
        </g>
      </svg>
    </div>
  )
}
