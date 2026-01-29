import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AddGoalFormProps {
  onAdd: (goal: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onCancel: () => void
}

const EMOJI_OPTIONS = ['🎮', '📱', '🚲', '🎸', '📚', '👟', '🎧', '🎨', '⚽', '🎁']

export function AddGoalForm({ onAdd, onCancel }: AddGoalFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [emoji, setEmoji] = useState('🎯')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !amount) return

    onAdd({
      name: name.trim(),
      targetAmount: parseFloat(amount),
      iconEmoji: emoji,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-goals-icon rounded-2xl p-4 space-y-4">
      <h3 className="text-lg font-bold text-goals-text">{t('goals.newGoal')}</h3>

      {/* Emoji picker */}
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

      {/* Name input */}
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

      {/* Amount input */}
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

      {/* Buttons */}
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
          {t('goals.addGoal')}
        </button>
      </div>
    </form>
  )
}
