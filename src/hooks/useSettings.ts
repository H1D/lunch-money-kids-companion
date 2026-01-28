import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, saveSettings, type Settings } from '../lib/db'
import { queryKeys } from '../lib/query'

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: getSettings,
  })
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Omit<Settings, 'id' | 'updatedAt'>) => saveSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
      queryClient.invalidateQueries({ queryKey: ['buckets'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

/**
 * Check if the app is configured (has token and account IDs)
 */
export function useIsConfigured() {
  const { data: settings, isLoading } = useSettings()

  const isConfigured = Boolean(
    settings?.lunchMoneyToken &&
    settings?.savingsAccountId &&
    settings?.goalsAccountId &&
    settings?.spendingAccountId
  )

  return { isConfigured, isLoading }
}
