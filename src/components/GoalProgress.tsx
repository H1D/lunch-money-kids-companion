import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      aria-label={t('a11y.editGoal', { name: goal.name })}
      className="bg-goals-icon/50 rounded-xl p-3 relative overflow-hidden w-full text-left"
    >
      {canAfford && <Confetti />}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{goal.iconEmoji || '🎯'}</span>
          <span className="font-medium text-goals-text text-sm">{goal.name}</span>
        </div>
        <span className="text-xs text-goals-subtitle">
          €{goal.targetAmount.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-goals-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            canAfford ? 'bg-success' : 'bg-accent'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-goals-subtitle">{Math.round(progress)}%</span>
        {canAfford && (
          <span className="text-xs text-success font-medium animate-pulse">{t('goals.ready')}</span>
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
  const { t } = useTranslation()

  if (goals.length === 0) {
    return (
      <div className="text-center text-goals-subtitle text-sm py-2">
        {t('buckets.goals.noGoals')}
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
