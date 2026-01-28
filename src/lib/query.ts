import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack Query client configuration
 * Optimized for offline-first with stale-while-revalidate
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show cached data immediately, refetch in background
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)

      // Retry configuration
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Network mode: always try cache first
      networkMode: 'offlineFirst',

      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
})

// Query keys for type safety and consistency
export const queryKeys = {
  settings: ['settings'] as const,
  preferences: ['preferences'] as const,
  goals: ['goals'] as const,
  buckets: (token: string) => ['buckets', token] as const,
  transactions: (token: string, accountId: number) => ['transactions', token, accountId] as const,
}
