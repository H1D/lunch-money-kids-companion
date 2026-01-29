import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useBuckets, useSpendingTransactions } from '../hooks/useBuckets'
import { useGoals, useAddGoal, useDeleteGoal, useUpdateGoal } from '../hooks/useGoals'
import { usePreferences } from '../hooks/usePreferences'
import { useSettings } from '../hooks/useSettings'
import { applyThemeByHue } from '../lib/theme'
import { BucketCard } from './BucketCard'
import { GoalList } from './GoalProgress'
import { TransactionList } from './TransactionList'
import { AddGoalForm } from './AddGoalForm'
import { SettingsPanel } from './SettingsPanel'
import { LastUpdated } from './LastUpdated'

interface DashboardProps {
  onOpenSettings: () => void
}

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const { t } = useTranslation()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [secretTapCount, setSecretTapCount] = useState(0)
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapCountRef = useRef(0) // Track actual count (refs don't have stale closure issues)

  const { data: buckets, isLoading, isRefetching, error } = useBuckets()
  const { data: transactionsData } = useSpendingTransactions()
  const { data: goals = [] } = useGoals()
  const { data: prefs } = usePreferences()
  const { data: settings } = useSettings()
  const addGoal = useAddGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  // Apply theme via OKLCH palette
  useEffect(() => {
    applyThemeByHue(prefs?.themeHue ?? 230)
  }, [prefs?.themeHue])

  // Secret tap to open parent settings (tap title 5 times quickly)
  const handleSecretTap = () => {
    // Clear any existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    // Use ref for actual count (avoids stale closure issues with rapid taps)
    tapCountRef.current += 1
    const newCount = tapCountRef.current
    setSecretTapCount(newCount) // Update state for UI display

    // Reset after 2 seconds of no taps
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0
      setSecretTapCount(0)
    }, 2000)

    // Open settings on 5th tap
    if (newCount >= 5) {
      onOpenSettings()
      tapCountRef.current = 0
      setSecretTapCount(0)
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
      }
    }
  }

  const handleAddGoal = async (goal: { name: string; targetAmount: number; iconEmoji?: string }) => {
    await addGoal.mutateAsync(goal)
    setShowAddGoal(false)
  }

  const handleEditGoal = async (id: number, updates: { name: string; targetAmount: number; iconEmoji?: string }) => {
    await updateGoal.mutateAsync({ id, ...updates })
  }

  const handleDeleteGoal = async (id: number) => {
    await deleteGoal.mutateAsync(id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💰</div>
          <p className="text-text-muted">{t('app.loading')}</p>
        </div>
      </div>
    )
  }

  if (error && !buckets) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😢</div>
          <p className="text-text-muted mb-4">{t('errors.loadFailed')}</p>
          <button
            onClick={onOpenSettings}
            className="px-6 py-3 bg-accent text-white rounded-xl font-medium"
          >
            {t('errors.checkSettings')}
          </button>
        </div>
      </div>
    )
  }

  const savingsBalance = buckets?.savings ? parseFloat(buckets.savings.balance) : 0
  const goalsBalance = buckets?.goals ? parseFloat(buckets.goals.balance) : 0
  const spendingBalance = buckets?.spending ? parseFloat(buckets.spending.balance) : 0

  // Get currency from accounts (default to EUR)
  const savingsCurrency = buckets?.savings?.currency?.toUpperCase() || 'EUR'
  const goalsCurrency = buckets?.goals?.currency?.toUpperCase() || 'EUR'
  const spendingCurrency = buckets?.spending?.currency?.toUpperCase() || 'EUR'

  return (
    <div className="min-h-screen bg-bg pb-8">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-center gap-3">
          <h1
            className="text-2xl font-bold text-text text-center cursor-pointer select-none"
            onClick={handleSecretTap}
          >
            {t('header.myMoney')} 💰
          </h1>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="text-lg opacity-50 hover:opacity-100 transition-opacity"
            aria-label={t('a11y.openSettings')}
          >
            ⚙️
          </button>
        </div>
        <SettingsPanel isOpen={settingsOpen} />
        {buckets?.lastUpdated && (
          <div className="mt-2">
            <LastUpdated date={buckets.lastUpdated} isRefetching={isRefetching} />
          </div>
        )}
      </header>

      {/* Buckets */}
      <main className="px-4 space-y-4">
        {/* Long-term Savings */}
        <BucketCard
          icon="🔒"
          title={t('buckets.vault.title')}
          subtitle={settings?.vaultSubtitle || t('buckets.vault.subtitle')}
          balance={savingsBalance}
          currency={savingsCurrency}
          color="vault"
        />

        {/* Goal Savings */}
        <BucketCard
          icon="🎯"
          title={t('buckets.goals.title')}
          subtitle={t('buckets.goals.subtitle')}
          balance={goalsBalance}
          currency={goalsCurrency}
          color="goals"
        >
          <GoalList
            goals={goals}
            availableBalance={goalsBalance}
            onDeleteGoal={handleDeleteGoal}
            onEditGoal={handleEditGoal}
          />

          {showAddGoal ? (
            <div className="mt-3">
              <AddGoalForm
                onAdd={handleAddGoal}
                onCancel={() => setShowAddGoal(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAddGoal(true)}
              className="w-full mt-3 py-2 rounded-xl bg-goals-border text-goals-text text-sm font-medium hover:bg-goals-icon transition-colors"
            >
              {t('buckets.goals.addGoal')}
            </button>
          )}
        </BucketCard>

        {/* Free Spending */}
        <BucketCard
          icon="💸"
          title={t('buckets.spending.title')}
          subtitle={t('buckets.spending.subtitle')}
          balance={spendingBalance}
          currency={spendingCurrency}
          color="spending"
        >
          {transactionsData?.transactions && (
            <div>
              <p className="text-xs text-spending-subtitle font-medium mb-2">{t('buckets.goals.recent')}</p>
              <TransactionList transactions={transactionsData.transactions} limit={5} />
            </div>
          )}
        </BucketCard>
      </main>

      {/* Secret tap indicator */}
      {secretTapCount > 0 && secretTapCount < 5 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface px-3 py-1 rounded-full">
          <span className="text-xs text-text-muted">{t('secretTap.moreTaps', { n: 5 - secretTapCount })}</span>
        </div>
      )}
    </div>
  )
}
