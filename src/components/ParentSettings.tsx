import { useState, useEffect } from 'react'
import { useSettings, useSaveSettings } from '../hooks/useSettings'

interface ParentSettingsProps {
  onClose: () => void
}

export function ParentSettings({ onClose }: ParentSettingsProps) {
  const { data: settings } = useSettings()
  const saveSettings = useSaveSettings()

  const [token, setToken] = useState('')
  const [savingsId, setSavingsId] = useState('')
  const [goalsId, setGoalsId] = useState('')
  const [spendingId, setSpendingId] = useState('')
  const [showToken, setShowToken] = useState(false)

  // Load existing settings
  useEffect(() => {
    if (settings) {
      setToken(settings.lunchMoneyToken || '')
      setSavingsId(settings.savingsAccountId?.toString() || '')
      setGoalsId(settings.goalsAccountId?.toString() || '')
      setSpendingId(settings.spendingAccountId?.toString() || '')
    }
  }, [settings])

  const handleSave = async () => {
    if (!token || !savingsId || !goalsId || !spendingId) {
      alert('Please fill in all fields')
      return
    }

    await saveSettings.mutateAsync({
      lunchMoneyToken: token,
      savingsAccountId: parseInt(savingsId, 10),
      goalsAccountId: parseInt(goalsId, 10),
      spendingAccountId: parseInt(spendingId, 10),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Parent Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-500 text-sm mb-6">
          Configure your Lunch Money API token and account IDs for the three money buckets.
        </p>

        <div className="space-y-4">
          {/* Token input */}
          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Lunch Money API Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your API token"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showToken ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Account IDs */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1">
                🔒 Long-term Savings Account ID (40%)
              </label>
              <input
                type="number"
                value={savingsId}
                onChange={(e) => setSavingsId(e.target.value)}
                placeholder="e.g., 251228"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">
                🎯 Goal Savings Account ID (40%)
              </label>
              <input
                type="number"
                value={goalsId}
                onChange={(e) => setGoalsId(e.target.value)}
                placeholder="e.g., 340219"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">
                💸 Free Spending Account ID (20%)
              </label>
              <input
                type="number"
                value={spendingId}
                onChange={(e) => setSpendingId(e.target.value)}
                placeholder="e.g., 340216"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saveSettings.isPending || !token || !savingsId || !goalsId || !spendingId}
          className="w-full mt-6 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>

        <p className="text-slate-500 text-xs text-center mt-4">
          Get your token from lunchmoney.app → Settings → Developers
        </p>
      </div>
    </div>
  )
}
