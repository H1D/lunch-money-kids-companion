import { useState, useEffect } from 'react'
import { useBuckets, useSpendingTransactions } from '../hooks/useBuckets'
import { useGoals, useAddGoal, useDeleteGoal, useUpdateGoal } from '../hooks/useGoals'
import { usePreferences } from '../hooks/usePreferences'
import { BucketCard } from './BucketCard'
import { GoalList } from './GoalProgress'
import { TransactionList } from './TransactionList'
import { AddGoalForm } from './AddGoalForm'
import { ThemePicker } from './ThemePicker'
import { LastUpdated } from './LastUpdated'

interface DashboardProps {
  onOpenSettings: () => void
}

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [secretTapCount, setSecretTapCount] = useState(0)

  const { data: buckets, isLoading, isRefetching, error } = useBuckets()
  const { data: transactionsData } = useSpendingTransactions()
  const { data: goals = [] } = useGoals()
  const { data: prefs } = usePreferences()
  const addGoal = useAddGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  // Apply theme to HTML element
  useEffect(() => {
    const theme = prefs?.theme || 'default'
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [prefs?.theme])

  // Secret tap to open parent settings (tap title 5 times quickly)
  const handleSecretTap = () => {
    setSecretTapCount((prev) => prev + 1)
    setTimeout(() => setSecretTapCount(0), 2000) // Reset after 2 seconds

    if (secretTapCount >= 4) {
      onOpenSettings()
      setSecretTapCount(0)
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💰</div>
          <p className="text-slate-500">Loading your money...</p>
        </div>
      </div>
    )
  }

  if (error && !buckets) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😢</div>
          <p className="text-slate-500 mb-4">Couldn't load your money buckets</p>
          <button
            onClick={onOpenSettings}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium"
          >
            Check Settings
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
    <div className="min-h-screen bg-[var(--color-bg)] pb-8">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-center gap-3">
          <h1
            className="text-2xl font-bold text-slate-800 text-center cursor-pointer select-none"
            onClick={handleSecretTap}
          >
            My Money 💰
          </h1>
          <button
            onClick={() => setShowThemePicker(true)}
            className="text-lg opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Change theme"
          >
            🎨
          </button>
        </div>
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
          title="Long-term Savings"
          subtitle="Until you're 18"
          balance={savingsBalance}
          currency={savingsCurrency}
          color="vault"
        />

        {/* Goal Savings */}
        <BucketCard
          icon="🎯"
          title="Goal Savings"
          subtitle="Save for what you want"
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
              className="w-full mt-3 py-2 rounded-xl bg-amber-200 text-amber-900 text-sm font-medium hover:bg-amber-300 transition-colors"
            >
              + Add Goal
            </button>
          )}
        </BucketCard>

        {/* Free Spending */}
        <BucketCard
          icon="💸"
          title="Free Spending"
          subtitle="Spend it however you want"
          balance={spendingBalance}
          currency={spendingCurrency}
          color="spending"
        >
          {transactionsData?.transactions && (
            <div>
              <p className="text-xs text-emerald-700 font-medium mb-2">Recent</p>
              <TransactionList transactions={transactionsData.transactions} limit={5} />
            </div>
          )}
        </BucketCard>
      </main>

      {/* Theme Picker */}
      {showThemePicker && (
        <ThemePicker onClose={() => setShowThemePicker(false)} />
      )}

      {/* Secret tap indicator */}
      {secretTapCount > 0 && secretTapCount < 5 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-200 px-3 py-1 rounded-full">
          <span className="text-xs text-slate-500">{5 - secretTapCount} more taps</span>
        </div>
      )}
    </div>
  )
}
