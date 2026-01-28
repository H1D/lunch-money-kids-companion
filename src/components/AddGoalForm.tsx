import { useState } from 'react'

interface AddGoalFormProps {
  onAdd: (goal: { name: string; targetAmount: number; iconEmoji?: string }) => void
  onCancel: () => void
}

const EMOJI_OPTIONS = ['🎮', '📱', '🚲', '🎸', '📚', '👟', '🎧', '🎨', '⚽', '🎁']

export function AddGoalForm({ onAdd, onCancel }: AddGoalFormProps) {
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
    <form onSubmit={handleSubmit} className="bg-white/10 rounded-2xl p-4 space-y-4">
      <h3 className="text-lg font-bold text-white">New Goal</h3>

      {/* Emoji picker */}
      <div>
        <label className="text-xs text-white/70 block mb-2">Pick an icon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-xl transition-all ${
                emoji === e
                  ? 'bg-amber-500/30 scale-110'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div>
        <label className="text-xs text-white/70 block mb-1">What are you saving for?</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="iPad, Bike, Games..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
          maxLength={50}
          required
        />
      </div>

      {/* Amount input */}
      <div>
        <label className="text-xs text-white/70 block mb-1">How much does it cost?</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !amount}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Goal
        </button>
      </div>
    </form>
  )
}
