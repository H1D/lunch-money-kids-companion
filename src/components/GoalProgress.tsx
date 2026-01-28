import { type Goal } from '../lib/db'

interface GoalProgressProps {
  goal: Goal
  availableBalance: number
  onDelete?: (id: number) => void
}

export function GoalProgress({ goal, availableBalance, onDelete }: GoalProgressProps) {
  const progress = Math.min((availableBalance / goal.targetAmount) * 100, 100)
  const canAfford = availableBalance >= goal.targetAmount

  return (
    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{goal.iconEmoji || '🎯'}</span>
          <span className="font-medium text-white text-sm">{goal.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">
            ${goal.targetAmount.toLocaleString()}
          </span>
          {onDelete && (
            <button
              onClick={() => goal.id && onDelete(goal.id)}
              className="text-white/50 hover:text-white/80 text-xs"
              aria-label="Delete goal"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            canAfford ? 'bg-green-400' : 'bg-white/80'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-white/60">{Math.round(progress)}%</span>
        {canAfford && (
          <span className="text-xs text-green-300 font-medium">Ready! 🎉</span>
        )}
      </div>
    </div>
  )
}

interface GoalListProps {
  goals: Goal[]
  availableBalance: number
  onDeleteGoal?: (id: number) => void
}

export function GoalList({ goals, availableBalance, onDeleteGoal }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center text-white/50 text-sm py-2">
        No goals yet. Add one!
      </div>
    )
  }

  // Sort goals by how close they are to completion
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = availableBalance / a.targetAmount
    const progressB = availableBalance / b.targetAmount
    return progressB - progressA
  })

  return (
    <div className="space-y-2">
      {sortedGoals.map((goal) => (
        <GoalProgress
          key={goal.id}
          goal={goal}
          availableBalance={availableBalance}
          onDelete={onDeleteGoal}
        />
      ))}
    </div>
  )
}
