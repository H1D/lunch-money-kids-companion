import { useState } from 'react'
import { type Goal } from '../lib/db'
import { Confetti } from './Confetti'
import { EditGoalForm } from './EditGoalForm'

interface GoalProgressProps {
  goal: Goal
  availableBalance: number
  onEdit?: (id: number, updates: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onDelete?: (id: number) => void
}

export function GoalProgress({ goal, availableBalance, onEdit, onDelete }: GoalProgressProps) {
  const [isEditing, setIsEditing] = useState(false)
  const progress = Math.min((availableBalance / goal.targetAmount) * 100, 100)
  const canAfford = availableBalance >= goal.targetAmount

  if (isEditing && onEdit) {
    return (
      <EditGoalForm
        goal={goal}
        onSave={(id, updates) => {
          onEdit(id, updates)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
        onDelete={onDelete}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      aria-label={`Edit goal ${goal.name}`}
      className="bg-amber-100/50 rounded-xl p-3 relative overflow-hidden w-full text-left"
    >
      {canAfford && <Confetti />}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{goal.iconEmoji || '🎯'}</span>
          <span className="font-medium text-amber-900 text-sm">{goal.name}</span>
        </div>
        <span className="text-xs text-amber-700">
          €{goal.targetAmount.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            canAfford ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-amber-700">{Math.round(progress)}%</span>
        {canAfford && (
          <span className="text-xs text-green-700 font-medium animate-pulse">Ready! 🎉</span>
        )}
      </div>
    </button>
  )
}

interface GoalListProps {
  goals: Goal[]
  availableBalance: number
  onEditGoal?: (id: number, updates: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onDeleteGoal?: (id: number) => void
}

export function GoalList({ goals, availableBalance, onEditGoal, onDeleteGoal }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center text-amber-700 text-sm py-2">
        No goals yet. Add one!
      </div>
    )
  }

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
          onEdit={onEditGoal}
          onDelete={onDeleteGoal}
        />
      ))}
    </div>
  )
}
