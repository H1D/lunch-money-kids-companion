import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings, useSaveSettings } from '../hooks/useSettings'

interface ParentSettingsProps {
  onClose: () => void
}

interface FormState {
  token: string
  savingsId: string
  goalsId: string
  spendingId: string
  initialized: boolean
}

export function ParentSettings({ onClose }: ParentSettingsProps) {
  const { t } = useTranslation()
  const { data: settings } = useSettings()
  const saveSettings = useSaveSettings()
  const [showToken, setShowToken] = useState(false)

  // Single state object with lazy initialization
  const [form, setForm] = useState<FormState>({
    token: '',
    savingsId: '',
    goalsId: '',
    spendingId: '',
    initialized: false,
  })

  // Derive display values: use form state if initialized, otherwise use settings
  const displayToken = form.initialized ? form.token : (settings?.lunchMoneyToken ?? '')
  const displaySavingsId = form.initialized ? form.savingsId : (settings?.savingsAccountId?.toString() ?? '')
  const displayGoalsId = form.initialized ? form.goalsId : (settings?.goalsAccountId?.toString() ?? '')
  const displaySpendingId = form.initialized ? form.spendingId : (settings?.spendingAccountId?.toString() ?? '')

  // Helper to update a field (marks form as initialized)
  const updateField = (field: keyof Omit<FormState, 'initialized'>, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // On first edit, copy all settings values to form state
      ...(prev.initialized
        ? {}
        : {
            token: settings?.lunchMoneyToken ?? '',
            savingsId: settings?.savingsAccountId?.toString() ?? '',
            goalsId: settings?.goalsAccountId?.toString() ?? '',
            spendingId: settings?.spendingAccountId?.toString() ?? '',
            initialized: true,
          }),
    }))
    // Then apply the edit
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!displayToken || !displaySavingsId || !displayGoalsId || !displaySpendingId) {
      alert(t('parentSettings.fillAllFields'))
      return
    }

    await saveSettings.mutateAsync({
      lunchMoneyToken: displayToken,
      savingsAccountId: parseInt(displaySavingsId, 10),
      goalsAccountId: parseInt(displayGoalsId, 10),
      spendingAccountId: parseInt(displaySpendingId, 10),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">{t('parentSettings.title')}</h2>
          <button
            onClick={onClose}
            className="text-text-subtle hover:text-text-muted text-2xl"
            aria-label={t('a11y.closeModal')}
          >
            ✕
          </button>
        </div>

        <p className="text-text-muted text-sm mb-6">
          {t('parentSettings.description')}
        </p>

        <div className="space-y-4">
          {/* Token input */}
          <div>
            <label className="text-xs text-text-muted block mb-1">
              {t('parentSettings.apiToken')}
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={displayToken}
                onChange={(e) => updateField('token', e.target.value)}
                placeholder={t('parentSettings.apiTokenPlaceholder')}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-accent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted"
              >
                {showToken ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Account IDs */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">
                🔒 {t('parentSettings.savingsAccount')}
              </label>
              <input
                type="number"
                value={displaySavingsId}
                onChange={(e) => updateField('savingsId', e.target.value)}
                placeholder={t('parentSettings.accountPlaceholder', { example: '251228' })}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-vault-border"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1">
                🎯 {t('parentSettings.goalsAccount')}
              </label>
              <input
                type="number"
                value={displayGoalsId}
                onChange={(e) => updateField('goalsId', e.target.value)}
                placeholder={t('parentSettings.accountPlaceholder', { example: '340219' })}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-goals-border"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1">
                💸 {t('parentSettings.spendingAccount')}
              </label>
              <input
                type="number"
                value={displaySpendingId}
                onChange={(e) => updateField('spendingId', e.target.value)}
                placeholder={t('parentSettings.accountPlaceholder', { example: '340216' })}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-spending-border"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saveSettings.isPending || !displayToken || !displaySavingsId || !displayGoalsId || !displaySpendingId}
          className="w-full mt-6 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveSettings.isPending ? t('parentSettings.saving') : t('parentSettings.saveSettings')}
        </button>

        <p className="text-text-muted text-xs text-center mt-4">
          {t('parentSettings.tokenHelp')}
        </p>
      </div>
    </div>
  )
}
