'use client'

import { useEffect, useRef, useState } from 'react'

// The AWS Builders - UST cloud mascot, recreated from the org site's hero: a white cloud whose face slides
// toward the cursor and reacts to what you're doing. Coordinates match the original 2380-unit artwork.
//
// Every expression is drawn with the SAME shapes: each eye and the mouth is one stroked path of two
// quadratic segments (10 numbers), plus a stroke width. A dot is a zero-length stroke with a round cap,
// "^" is two strokes meeting at a point, and so on. Switching expression springs every number toward
// the new pose, so the features morph into each other instead of fading between drawings.
const CLOUD = 'M 470 1821 A 415 415 0 0 1 375 1023 A 268 268 0 0 1 809 819 A 553 553 0 0 1 1862 1059 A 400 400 0 0 1 1827 1821 Z'
const FACE = 'rgb(93 55 166)'
const VIEWBOX = '60 440 2180 1440' // cropped to the cloud
const EYE_X = [683, 1696]

type Expression = 'neutral' | 'smile' | 'surprised' | 'starstruck' | 'happy'
type Stroke = number[] // [x0,y0, c1x,c1y, x1,y1, c2x,c2y, x2,y2]
type Pose = { left: Stroke; right: Stroke; mouth: Stroke; eyeW: number; mouthW: number; blush: number; shine: number; squishX: number; squishY: number }

const dot = (x: number, y: number): Stroke => [x, y, x, y, x, y, x, y, x, y]
const caret = (x: number): Stroke => [x - 70, 1225, x - 35, 1187.5, x, 1150, x + 35, 1187.5, x + 70, 1225]
const body = { squishX: 1, squishY: 1 }
const dotEyes = { left: dot(EYE_X[0], 1191), right: dot(EYE_X[1], 1191), eyeW: 102, blush: 0, shine: 0, ...body }

const POSES: Record<Expression, Pose> = {
  // · — ·
  neutral: { ...dotEyes, mouth: [918, 1190, 1043, 1190, 1168, 1190, 1293, 1190, 1418, 1190], mouthW: 100 },
  // · ‿ ·  (the original's smile, split into two halves)
  smile: { ...dotEyes, mouth: [910, 1158, 1039, 1289, 1168, 1289, 1298, 1289, 1428, 1158], mouthW: 100 },
  // · ● ·  hovering "Post a build"
  surprised: { ...dotEyes, mouth: dot(1168, 1235), mouthW: 160 },
  // ^v^ with blush, being rubbed
  happy: { left: caret(EYE_X[0]), right: caret(EYE_X[1]), eyeW: 48, mouth: [1088, 1190, 1128, 1227.5, 1168, 1265, 1208, 1227.5, 1248, 1190], mouthW: 48, blush: 1, shine: 0, squishX: 1.04, squishY: 0.965 },
  // big shiny eyes and an open O, hovering a build card
  starstruck: { left: dot(EYE_X[0], 1180), right: dot(EYE_X[1], 1180), eyeW: 210, mouth: [1168, 1275, 1168, 1282, 1168, 1290, 1168, 1298, 1168, 1305], mouthW: 160, blush: 0, shine: 1, ...body },
}

// Pose <-> flat number list, so one spring can drive everything.
const flatten = (p: Pose) => [...p.left, ...p.right, ...p.mouth, p.eyeW, p.mouthW, p.blush, p.shine, p.squishX, p.squishY]
const d = (s: number[], i: number) => `M ${s[i]} ${s[i + 1]} Q ${s[i + 2]} ${s[i + 3]} ${s[i + 4]} ${s[i + 5]} Q ${s[i + 6]} ${s[i + 7]} ${s[i + 8]} ${s[i + 9]}`

/** What the face should do for whatever is under the pointer. */
function expressionFor(target: EventTarget | null): Expression {
  if (!(target instanceof Element)) return 'neutral'
  if (target.closest('a[href="/builds/new"]')) return 'surprised' // "Post a build"
  if (target.closest('article')) return 'starstruck' // a build card
  if (target.closest('a[href], button, summary, input, textarea')) return 'smile'
  return 'neutral'
}

// Rubbing = the pointer changes horizontal direction a few times over the cloud within a short window.
const RUB_REVERSALS = 3
const RUB_WINDOW_MS = 900
const RUB_HOLD_MS = 1200 // keep smiling a moment after you stop

// Spring feel for the morph: a little bouncy, settles in ~0.4s.
const STIFFNESS = 0.14
const DAMPING = 0.7
const SPARKLE = 'M 0 -50 Q 10 -10 50 0 Q 10 10 0 50 Q -10 10 -50 0 Q -10 -10 0 -50 Z'

export function Mascot() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<SVGGElement>(null)
  const faceRef = useRef<SVGGElement>(null)
  const leftRef = useRef<SVGPathElement>(null)
  const rightRef = useRef<SVGPathElement>(null)
  const mouthRef = useRef<SVGPathElement>(null)
  const blushRefs = useRef<(SVGEllipseElement | null)[]>([])
  const shineRefs = useRef<(SVGGElement | null)[]>([])
  const poseTarget = useRef(flatten(POSES.neutral))
  const kick = useRef<() => void>(() => {})
  const [hoverExpression, setHoverExpression] = useState<Expression>('neutral')
  const [rubbing, setRubbing] = useState(false)
  const expression = rubbing ? 'happy' : hoverExpression

  // New expression: point the spring at its pose and wake the animation loop.
  useEffect(() => {
    poseTarget.current = flatten(POSES[expression])
    kick.current()
  }, [expression])

  useEffect(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const pose = [...poseTarget.current]
    const vel = pose.map(() => 0)
    const look = { x: 0, y: 0, tx: 0, ty: 0 }
    const rub = { lastX: 0, dir: 0, reversals: [] as number[] }
    let rubTimer: number | undefined
    let frame: number | null = null

    function draw() {
      const p = pose
      leftRef.current?.setAttribute('d', d(p, 0))
      rightRef.current?.setAttribute('d', d(p, 10))
      mouthRef.current?.setAttribute('d', d(p, 20))
      const [eyeW, mouthW, blush, shine, sx, sy] = p.slice(30)
      leftRef.current?.setAttribute('stroke-width', String(Math.max(0, eyeW)))
      rightRef.current?.setAttribute('stroke-width', String(Math.max(0, eyeW)))
      mouthRef.current?.setAttribute('stroke-width', String(Math.max(0, mouthW)))
      blushRefs.current.forEach(el => {
        el?.setAttribute('opacity', String(Math.max(0, Math.min(1, blush)) * 0.75))
        el?.setAttribute('ry', String(62 * Math.max(0, blush)))
      })
      // Shine (highlights + sparkles) rides on each eye's centre point and grows with `shine`.
      shineRefs.current.forEach((el, i) => {
        const cx = p[i * 10 + 4], cy = p[i * 10 + 5]
        el?.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0, shine)})`)
      })
      // Squish the whole cloud from its bottom centre.
      bodyRef.current?.setAttribute('transform', `translate(1148 1821) scale(${sx} ${sy}) translate(-1148 -1821)`)
      faceRef.current?.setAttribute('transform', `translate(${look.x} ${look.y})`)
    }

    function tick() {
      const target = poseTarget.current
      let moving = false
      for (let i = 0; i < pose.length; i++) {
        vel[i] = (vel[i] + (target[i] - pose[i]) * STIFFNESS) * DAMPING
        pose[i] += vel[i]
        if (Math.abs(target[i] - pose[i]) > 0.05 || Math.abs(vel[i]) > 0.05) moving = true
        else { pose[i] = target[i]; vel[i] = 0 }
      }
      look.x += (look.tx - look.x) * 0.16
      look.y += (look.ty - look.y) * 0.16
      if (Math.abs(look.tx - look.x) > 0.1 || Math.abs(look.ty - look.y) > 0.1) moving = true
      else { look.x = look.tx; look.y = look.ty }
      draw()
      frame = moving ? requestAnimationFrame(tick) : null
    }

    kick.current = () => {
      if (reducedMotion) {
        pose.splice(0, pose.length, ...poseTarget.current)
        draw()
        return
      }
      frame ??= requestAnimationFrame(tick)
    }

    function trackRub(e: PointerEvent) {
      const onCloud = e.target instanceof Element && !!e.target.closest('[data-cloud]')
      if (!onCloud) return
      const dx = e.clientX - rub.lastX
      rub.lastX = e.clientX
      if (Math.abs(dx) < 3) return
      const dir = Math.sign(dx)
      const now = performance.now()
      if (rub.dir && dir !== rub.dir) rub.reversals.push(now)
      rub.dir = dir
      rub.reversals = rub.reversals.filter(t => now - t < RUB_WINDOW_MS)
      if (rub.reversals.length >= RUB_REVERSALS) {
        setRubbing(true)
        window.clearTimeout(rubTimer)
        rubTimer = window.setTimeout(() => setRubbing(false), RUB_HOLD_MS)
      }
    }

    function onMove(e: PointerEvent) {
      trackRub(e)
      if (e.pointerType === 'touch') return
      setHoverExpression(expressionFor(e.target))
      const box = wrapRef.current?.getBoundingClientRect()
      if (!box || reducedMotion) return
      const clamp = (n: number) => Math.max(-1, Math.min(1, n))
      const h = clamp((e.clientX - (box.left + box.width / 2)) / (box.width / 2))
      const v = clamp((e.clientY - (box.top + box.height / 2)) / (box.height / 2))
      // Limits in viewBox units: roomier sideways and downward than upward, like the original.
      look.tx = h * 170
      look.ty = v < 0 ? v * 100 : v * 230
      kick.current()
    }
    function reset() {
      setHoverExpression('neutral')
      look.tx = 0
      look.ty = 0
      kick.current()
    }

    draw()
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.clearTimeout(rubTimer)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  const neutral = POSES.neutral
  const line = { fill: 'none', stroke: FACE, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  // touch-pan-y: a finger can rub sideways on the cloud while vertical swipes still scroll the page
  return (
    <div ref={wrapRef} className="relative mx-auto mb-4 w-[clamp(200px,34vw,360px)] animate-float touch-pan-y" aria-hidden>
      <div className="absolute inset-[10%] rounded-full bg-lavender/40 blur-3xl" />
      <svg viewBox={VIEWBOX} className="relative w-full h-auto overflow-visible drop-shadow-[0_18px_40px_rgba(46,26,95,0.35)]">
        <g ref={bodyRef} data-cloud className={rubbing ? 'cursor-grabbing' : 'cursor-grab'}>
          <path d={CLOUD} fill="white" />
          <g ref={faceRef}>
            {EYE_X.map((x, i) => (
              <ellipse key={x} ref={el => { blushRefs.current[i] = el }} cx={x + (i ? 40 : -40)} cy={1345} rx={120} ry={0} fill="#F9A8D4" opacity={0} />
            ))}
            <path ref={leftRef} d={d(flatten(neutral), 0)} {...line} strokeWidth={neutral.eyeW} />
            <path ref={rightRef} d={d(flatten(neutral), 10)} {...line} strokeWidth={neutral.eyeW} />
            <path ref={mouthRef} d={d(flatten(neutral), 20)} {...line} strokeWidth={neutral.mouthW} />
            {/* eye highlights + a sparkle per eye, positioned relative to the eye centre */}
            {EYE_X.map((x, i) => (
              <g key={x} ref={el => { shineRefs.current[i] = el }} transform={`translate(${x} 1191) scale(0)`}>
                <circle cx={34} cy={-40} r={34} fill="white" />
                <circle cx={-30} cy={38} r={16} fill="white" />
                <g transform="translate(150 -120)">
                  <path className="mascot-sparkle" d={SPARKLE} fill="#FDE68A" />
                </g>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
