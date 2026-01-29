import { useQuery } from '@tanstack/react-query'
import { getAllAccounts, type Account } from '../lib/api'
import { queryKeys } from '../lib/query'

/**
 * Fetch all accounts for a given API token
 * Used in ParentSettings to populate account dropdowns
 */
export function useAccounts(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.accounts(token ?? ''),
    queryFn: () => getAllAccounts(token!),
    enabled: Boolean(token && token.length > 10), // Only fetch when token looks valid
    staleTime: 1000 * 60 * 10, // 10 minutes - accounts don't change often
    retry: 1, // Don't retry too much for invalid tokens
  })
}

export type { Account }
