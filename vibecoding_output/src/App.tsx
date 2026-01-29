import { useState, useEffect, useRef } from 'react'
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
  const [setupTapCount, setSetupTapCount] = useState(0)
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapCountRef = useRef(0) // Track actual count (refs don't have stale closure issues)

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

  // Handle tap on moneybag to open settings (first-time setup)
  const handleSetupTap = () => {
    // Clear any existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
    }

    // Use ref for actual count (avoids stale closure issues with rapid taps)
    tapCountRef.current += 1
    const newCount = tapCountRef.current
    setSetupTapCount(newCount) // Update state for UI display

    // Reset after 2 seconds of no taps
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0
      setSetupTapCount(0)
    }, 2000)

    // Open settings on 5th tap
    if (newCount >= 5) {
      setShowSettings(true)
      tapCountRef.current = 0
      setSetupTapCount(0)
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
      }
    }
  }

  // Show loading state only if not opening settings (prevents modal from being hidden during rapid taps)
  if (isLoading && !showSettings) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-4xl animate-pulse">💰</div>
      </div>
    )
  }

  // Show welcome screen if not configured
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <button
            onClick={handleSetupTap}
            className="text-6xl mb-6 cursor-pointer hover:scale-110 transition-transform active:scale-95 select-none"
            aria-label={t('app.tapToSetup')}
          >
            💰
          </button>
          <h1 className="text-2xl font-bold text-text mb-1">{t('app.title')}</h1>
          <p className="text-text-muted mb-2">{t('app.subtitle')}</p>
          <p className="text-xs text-text-subtle mb-6">{t('app.disclaimer')}</p>

          {/* Tap indicator */}
          {setupTapCount > 0 && setupTapCount < 5 && (
            <p className="text-sm text-text-muted animate-pulse">
              {t('secretTap.moreTaps', { n: 5 - setupTapCount })}
            </p>
          )}

          {setupTapCount === 0 && (
            <p className="text-sm text-text-subtle">
              {t('app.tapToSetup')}
            </p>
          )}
        </div>

        {/* Settings modal with view transition */}
        {showSettings && (
          <div
            className="animate-in zoom-in-95 fade-in duration-200"
            style={{ viewTransitionName: 'settings-modal' }}
          >
            <ParentSettings onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Dashboard onOpenSettings={() => setShowSettings(true)} />
      {showSettings && (
        <div
          className="animate-in zoom-in-95 fade-in duration-200"
          style={{ viewTransitionName: 'settings-modal' }}
        >
          <ParentSettings onClose={() => setShowSettings(false)} />
        </div>
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
