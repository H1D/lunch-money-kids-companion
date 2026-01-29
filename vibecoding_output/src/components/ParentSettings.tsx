import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings, useSaveSettings } from '../hooks/useSettings'
import { useAccounts, type Account } from '../hooks/useAccounts'

interface ParentSettingsProps {
  onClose: () => void
}

interface FormState {
  token: string
  savingsId: string
  goalsId: string
  spendingId: string
  vaultSubtitle: string
  initialized: boolean
}

interface AccountSelectProps {
  id: string
  value: string
  onChange: (value: string) => void
  icon: string
  label: string
  ringColor: string
  hasAccounts: boolean
  groupedAccounts: { manual: Account[]; plaid: Account[] }
  formatAccountOption: (account: Account) => string
  placeholderText: string
  selectAccountText: string
  manualAccountsText: string
  linkedAccountsText: string
}

function AccountSelect({
  id,
  value,
  onChange,
  icon,
  label,
  ringColor,
  hasAccounts,
  groupedAccounts,
  formatAccountOption,
  placeholderText,
  selectAccountText,
  manualAccountsText,
  linkedAccountsText,
}: AccountSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-text-muted block mb-1">
        {icon} {label}
      </label>
      {hasAccounts ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-surface border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 ${ringColor} appearance-none cursor-pointer`}
        >
          <option value="">{selectAccountText}</option>
          {groupedAccounts.manual.length > 0 && (
            <optgroup label={manualAccountsText}>
              {groupedAccounts.manual.map((account) => (
                <option key={`asset-${account.id}`} value={account.id.toString()}>
                  {formatAccountOption(account)}
                </option>
              ))}
            </optgroup>
          )}
          {groupedAccounts.plaid.length > 0 && (
            <optgroup label={linkedAccountsText}>
              {groupedAccounts.plaid.map((account) => (
                <option key={`plaid-${account.id}`} value={account.id.toString()}>
                  {formatAccountOption(account)}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      ) : (
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholderText}
          className={`w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:ring-2 ${ringColor}`}
        />
      )}
    </div>
  )
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
    vaultSubtitle: '',
    initialized: false,
  })

  // Default vault subtitle from i18n
  const defaultVaultSubtitle = t('buckets.vault.subtitle')

  // Derive display values: use form state if initialized, otherwise use settings
  const displayToken = form.initialized ? form.token : (settings?.lunchMoneyToken ?? '')
  const displaySavingsId = form.initialized ? form.savingsId : (settings?.savingsAccountId?.toString() ?? '')
  const displayGoalsId = form.initialized ? form.goalsId : (settings?.goalsAccountId?.toString() ?? '')
  const displaySpendingId = form.initialized ? form.spendingId : (settings?.spendingAccountId?.toString() ?? '')
  const displayVaultSubtitle = form.initialized ? form.vaultSubtitle : (settings?.vaultSubtitle ?? defaultVaultSubtitle)

  // Fetch accounts when token is available
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(displayToken)

  // Group accounts by source for better UX
  const groupedAccounts = useMemo(() => {
    if (!accounts) return { manual: [], plaid: [] }
    return {
      manual: accounts.filter(a => a.source === 'asset'),
      plaid: accounts.filter(a => a.source === 'plaid'),
    }
  }, [accounts])

  const hasAccounts = accounts && accounts.length > 0

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
            vaultSubtitle: settings?.vaultSubtitle ?? defaultVaultSubtitle,
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
      vaultSubtitle: displayVaultSubtitle === defaultVaultSubtitle ? '' : displayVaultSubtitle,
    })

    onClose()
  }

  // Format account option label
  const formatAccountOption = (account: Account) => {
    const balance = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: account.currency,
    }).format(parseFloat(account.balance))
    return `${account.name} (${balance})`
  }

  // Shared props for AccountSelect
  const accountSelectSharedProps = {
    hasAccounts: Boolean(hasAccounts),
    groupedAccounts,
    formatAccountOption,
    placeholderText: t('parentSettings.accountPlaceholder', { example: '251228' }),
    selectAccountText: t('parentSettings.selectAccount'),
    manualAccountsText: t('parentSettings.manualAccounts'),
    linkedAccountsText: t('parentSettings.linkedAccounts'),
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
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

        {/* Step 1: Token input */}
        <div className="space-y-4">
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

            {/* Token status / help */}
            <div className="text-xs mt-2">
              {!displayToken && (
                <a
                  href="https://my.lunchmoney.app/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline"
                >
                  {t('parentSettings.getToken')} →
                </a>
              )}
              {displayToken && displayToken.length > 10 && (
                <>
                  {accountsLoading && (
                    <span className="text-text-subtle">{t('parentSettings.loadingAccounts')}</span>
                  )}
                  {accountsError && (
                    <span className="text-danger">{t('parentSettings.accountsError')}</span>
                  )}
                  {hasAccounts && (
                    <span className="text-success">
                      ✓ {t('parentSettings.accountsLoaded', { count: accounts.length })}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Step 2: Account selections - only shown after accounts loaded */}
          {hasAccounts && (
            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border">
              {/* Long-term Savings */}
              <div>
                <AccountSelect
                  {...accountSelectSharedProps}
                  id="savings-account"
                  value={displaySavingsId}
                  onChange={(value) => updateField('savingsId', value)}
                  icon="🔒"
                  label={t('parentSettings.savingsAccount')}
                  ringColor="focus:ring-vault-border"
                />
                <input
                  type="text"
                  value={displayVaultSubtitle}
                  onChange={(e) => updateField('vaultSubtitle', e.target.value)}
                  placeholder={defaultVaultSubtitle}
                  className="w-full mt-2 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-vault-border"
                  maxLength={50}
                />
                <p className="text-xs text-text-subtle mt-1">{t('parentSettings.vaultSubtitleHint')}</p>
              </div>

              {/* Goal Savings */}
              <AccountSelect
                {...accountSelectSharedProps}
                id="goals-account"
                value={displayGoalsId}
                onChange={(value) => updateField('goalsId', value)}
                icon="🎯"
                label={t('parentSettings.goalsAccount')}
                ringColor="focus:ring-goals-border"
              />

              {/* Free Spending */}
              <AccountSelect
                {...accountSelectSharedProps}
                id="spending-account"
                value={displaySpendingId}
                onChange={(value) => updateField('spendingId', value)}
                icon="💸"
                label={t('parentSettings.spendingAccount')}
                ringColor="focus:ring-spending-border"
              />
            </div>
          )}
        </div>

        {/* Save button - only enabled when all accounts selected */}
        {hasAccounts && (
          <button
            onClick={handleSave}
            disabled={saveSettings.isPending || !displaySavingsId || !displayGoalsId || !displaySpendingId}
            className="w-full mt-6 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveSettings.isPending ? t('parentSettings.saving') : t('parentSettings.saveSettings')}
          </button>
        )}
      </div>
    </div>
  )
}
