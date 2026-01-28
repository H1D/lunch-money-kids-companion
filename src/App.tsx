import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query'
import { Dashboard } from './components/Dashboard'
import { ParentSettings } from './components/ParentSettings'
import { useIsConfigured } from './hooks/useSettings'
import { saveSettings } from './lib/db'

function AppContent() {
  const { t } = useTranslation()
  const { isConfigured, isLoading } = useIsConfigured()
  const [showSettings, setShowSettings] = useState(false)

  // Auto-load dev settings from env vars (DEV MODE ONLY - never in production builds)
  useEffect(() => {
    // SECURITY: Only run in development mode
    if (!import.meta.env.DEV) return

    const loadDevSettings = async () => {
      const token = import.meta.env.VITE_LUNCH_MONEY_TOKEN
      const savingsId = import.meta.env.VITE_SAVINGS_ACCOUNT_ID
      const goalsId = import.meta.env.VITE_GOALS_ACCOUNT_ID
      const spendingId = import.meta.env.VITE_SPENDING_ACCOUNT_ID

      if (token && savingsId && goalsId && spendingId && !isConfigured && !isLoading) {
        console.log('[Dev] Auto-loading settings from environment variables')
        await saveSettings({
          lunchMoneyToken: token,
          savingsAccountId: parseInt(savingsId, 10),
          goalsAccountId: parseInt(goalsId, 10),
          spendingAccountId: parseInt(spendingId, 10),
        })
        // Invalidate queries to reload with new settings
        queryClient.invalidateQueries()
      }
    }

    loadDevSettings()
  }, [isConfigured, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-4xl animate-pulse">💰</div>
      </div>
    )
  }

  // Show settings if not configured
  if (!isConfigured && !showSettings) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-6">💰</div>
          <h1 className="text-2xl font-bold text-text mb-2">{t('app.title')}</h1>
          <p className="text-text-muted mb-6">{t('app.tagline')}</p>
          <button
            onClick={() => setShowSettings(true)}
            className="px-8 py-4 bg-accent text-white rounded-2xl font-semibold hover:bg-accent-hover transition-colors"
          >
            {t('app.getStarted')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dashboard onOpenSettings={() => setShowSettings(true)} />
      {showSettings && (
        <ParentSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
