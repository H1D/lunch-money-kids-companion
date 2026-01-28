import { useState } from 'react'
import { type Goal } from '../lib/db'

interface EditGoalFormProps {
  goal: Goal
  onSave: (id: number, updates: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onCancel: () => void
  onDelete?: (id: number) => void
}

const EMOJI_OPTIONS = ['🎮', '📱', '🚲', '🎸', '📚', '👟', '🎧', '🎨', '⚽', '🎁']

export function EditGoalForm({ goal, onSave, onCancel, onDelete }: EditGoalFormProps) {
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
    if (confirm('Delete this goal?')) {
      onDelete(goal.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-100 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-amber-900">Edit Goal</h3>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            aria-label="Delete goal"
          >
            Delete
          </button>
        )}
      </div>

      <div>
        <label className="text-xs text-amber-700 block mb-2">Pick an icon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-xl transition-all ${
                emoji === e
                  ? 'bg-amber-300 scale-110'
                  : 'bg-amber-50 hover:bg-amber-200'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-amber-700 block mb-1">What are you saving for?</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="iPad, Bike, Games..."
          className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          maxLength={50}
          required
        />
      </div>

      <div>
        <label className="text-xs text-amber-700 block mb-1">How much does it cost?</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">€</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white border border-amber-200 rounded-xl pl-8 pr-4 py-3 text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
          className="flex-1 py-3 rounded-xl bg-amber-200 text-amber-800 font-medium hover:bg-amber-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !amount}
          className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </form>
  )
}
