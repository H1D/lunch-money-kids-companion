import { type ReactNode } from 'react'

interface BucketCardProps {
  icon: string
  title: string
  subtitle?: string
  balance: string | number
  currency?: string
  color: 'vault' | 'goals' | 'spending'
  children?: ReactNode
}

const colorClasses = {
  vault: 'from-purple-600 to-purple-800 border-purple-500/30',
  goals: 'from-amber-500 to-amber-700 border-amber-500/30',
  spending: 'from-emerald-500 to-emerald-700 border-emerald-500/30',
}

const iconBgClasses = {
  vault: 'bg-purple-500/20',
  goals: 'bg-amber-500/20',
  spending: 'bg-emerald-500/20',
}

export function BucketCard({
  icon,
  title,
  subtitle,
  balance,
  currency = 'USD',
  color,
  children,
}: BucketCardProps) {
  const formattedBalance = typeof balance === 'number'
    ? balance.toLocaleString('en-US', { style: 'currency', currency })
    : parseFloat(balance).toLocaleString('en-US', { style: 'currency', currency })

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-5
        bg-gradient-to-br ${colorClasses[color]}
        border shadow-xl
        transform transition-transform active:scale-[0.98]
      `}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl ${iconBgClasses[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-xs text-white/70">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-3xl font-bold text-white tracking-tight">
            {formattedBalance}
          </p>
        </div>

        {/* Children (e.g., progress bars, transactions) */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
