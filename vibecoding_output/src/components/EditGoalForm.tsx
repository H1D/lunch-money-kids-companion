import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Goal } from '../lib/db'

interface EditGoalFormProps {
  goal: Goal
  onSave: (id: number, updates: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onCancel: () => void
  onDelete?: (id: number) => void
}

const EMOJI_OPTIONS = ['🎮', '📱', '🚲', '🎸', '📚', '👟', '🎧', '🎨', '⚽', '🎁']

export function EditGoalForm({ goal, onSave, onCancel, onDelete }: EditGoalFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(goal.name)
  const [amount, setAmount] = useState(goal.targetAmount.toString())
  const [emoji, setEmoji] = useState(goal.iconEmoji || '🎯')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !amount || !goal.id) return

    onSave(goal.id, {
      name: name.trim(),
      targetAmount: parseFloat(amount),
      iconEmoji: emoji,
    })
  }

  const handleDelete = () => {
    if (!goal.id || !onDelete) return
    if (confirm(t('goals.deleteConfirm'))) {
      onDelete(goal.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-goals-icon rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-goals-text">{t('goals.editGoal')}</h3>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-danger hover:text-danger font-medium px-2 py-1 rounded-lg hover:bg-danger-light transition-colors"
            aria-label={t('a11y.deleteGoal')}
          >
            {t('goals.delete')}
          </button>
        )}
      </div>

      <div>
        <label className="text-xs text-goals-subtitle block mb-2">{t('goals.pickIcon')}</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-xl transition-all ${
                emoji === e
                  ? 'bg-goals-border scale-110'
                  : 'bg-goals-bg hover:bg-goals-border'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-goals-subtitle block mb-1">{t('goals.savingFor')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('goals.savingForPlaceholder')}
          className="w-full bg-white border border-goals-border rounded-xl px-4 py-3 text-goals-text placeholder-goals-subtitle focus:outline-none focus:ring-2 focus:ring-accent"
          maxLength={50}
          required
        />
      </div>

      <div>
        <label className="text-xs text-goals-subtitle block mb-1">{t('goals.howMuch')}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-goals-subtitle">€</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white border border-goals-border rounded-xl pl-8 pr-4 py-3 text-goals-text placeholder-goals-subtitle focus:outline-none focus:ring-2 focus:ring-accent"
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-goals-border text-goals-text font-medium hover:bg-goals-icon transition-colors"
        >
          {t('goals.cancel')}
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !amount}
          className="flex-1 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('goals.save')}
        </button>
      </div>
    </form>
  )
}
