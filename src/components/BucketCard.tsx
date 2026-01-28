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
  vault: 'bg-purple-50 border-purple-200',
  goals: 'bg-amber-50 border-amber-200',
  spending: 'bg-emerald-50 border-emerald-200',
}

const iconBgClasses = {
  vault: 'bg-purple-100',
  goals: 'bg-amber-100',
  spending: 'bg-emerald-100',
}

const textClasses = {
  vault: 'text-purple-900',
  goals: 'text-amber-900',
  spending: 'text-emerald-900',
}

const subtitleClasses = {
  vault: 'text-purple-700',
  goals: 'text-amber-800',
  spending: 'text-emerald-700',
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
        relative overflow-hidden rounded-2xl p-5
        ${colorClasses[color]}
        border shadow-sm
        transform transition-transform active:scale-[0.99]
      `}
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl ${iconBgClasses[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${textClasses[color]}`}>{title}</h2>
            {subtitle && (
              <p className={`text-xs ${subtitleClasses[color]}`}>{subtitle}</p>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className={`text-3xl font-bold tracking-tight ${textClasses[color]}`}>
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
