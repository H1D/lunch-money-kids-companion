const PARTICLES = Array.from({ length: 12 }, (_, i) => i)

const COLORS = [
  'bg-yellow-400',
  'bg-green-400',
  'bg-pink-400',
  'bg-blue-400',
  'bg-purple-400',
  'bg-orange-400',
]

export function Confetti() {
  return (
    <div className="confetti-container absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {PARTICLES.map((i) => (
        <div
          key={i}
          className={`confetti-particle absolute w-1.5 h-1.5 rounded-full ${COLORS[i % COLORS.length]}`}
          style={{
            left: `${8 + (i * 7.5)}%`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}
