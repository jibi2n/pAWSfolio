// Twinkling stars for the purple backgrounds (hero, login, signup). Pure CSS, no JS.
// Positions come from a seeded generator so server and browser render the same stars.
function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

const rand = seeded(42)
const STARS = Array.from({ length: 70 }, () => {
  const big = rand() < 0.12
  return {
    left: rand() * 100,
    top: rand() * 75, // mostly the upper sky; the clouds sit lower
    size: big ? 3.5 + rand() * 1.5 : 1.5 + rand() * 1.8,
    delay: rand() * 5,
    duration: 2.5 + rand() * 3.5,
    opacity: 0.5 + rand() * 0.5,
  }
})
const SPARKLES = Array.from({ length: 6 }, () => ({
  left: 4 + rand() * 92,
  top: 4 + rand() * 55,
  size: 12 + rand() * 10,
  delay: rand() * 4,
  duration: 3 + rand() * 2,
}))

export function Starfield() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 3 ? '0 0 6px 1px rgba(255,255,255,0.6)' : undefined,
          }}
        />
      ))}
      {SPARKLES.map((s, i) => (
        <svg
          key={`s${i}`}
          viewBox="-50 -50 100 100"
          className="star-sparkle absolute"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
        >
          <path d="M 0 -50 Q 8 -8 50 0 Q 8 8 0 50 Q -8 8 -50 0 Q -8 -8 0 -50 Z" fill="white" />
        </svg>
      ))}
    </div>
  )
}
