import { useQuery } from '@tanstack/react-query'
import { getBucketBalances, getTransactions, type Asset, type Transaction } from '../lib/api'
import { useSettings } from './useSettings'
import { queryKeys } from '../lib/query'
import {
  cacheBucketBalances,
  getCachedBalances,
  cacheTransactions,
  getCachedTransactions,
  type CachedBalance,
  type CachedTransaction,
} from '../lib/db'

export interface BucketData {
  savings: Asset | undefined
  goals: Asset | undefined
  spending: Asset | undefined
  lastUpdated: Date
}

export function useBuckets() {
  const { data: settings } = useSettings()

  return useQuery({
    queryKey: settings?.lunchMoneyToken
      ? queryKeys.buckets(settings.lunchMoneyToken)
      : ['buckets-disabled'],
    queryFn: async (): Promise<BucketData> => {
      if (!settings?.lunchMoneyToken) {
        // Try to load from cache
        const cached = await getCachedBalances()
        if (cached.length > 0) {
          return {
            savings: cached.find(c => c.accountId === settings?.savingsAccountId) as unknown as Asset,
            goals: cached.find(c => c.accountId === settings?.goalsAccountId) as unknown as Asset,
            spending: cached.find(c => c.accountId === settings?.spendingAccountId) as unknown as Asset,
            lastUpdated: cached[0]?.cachedAt ?? new Date(),
          }
        }
        throw new Error('No token configured')
      }

      try {
        const buckets = await getBucketBalances(
          settings.lunchMoneyToken,
          settings.savingsAccountId,
          settings.goalsAccountId,
          settings.spendingAccountId
        )

        // Cache the results
        const toCache: CachedBalance[] = []
        if (buckets.savings) {
          toCache.push({
            accountId: buckets.savings.id,
            balance: buckets.savings.balance,
            balanceAsOf: buckets.savings.balance_as_of,
            currency: buckets.savings.currency,
            name: buckets.savings.name,
            cachedAt: new Date(),
          })
        }
        if (buckets.goals) {
          toCache.push({
            accountId: buckets.goals.id,
            balance: buckets.goals.balance,
            balanceAsOf: buckets.goals.balance_as_of,
            currency: buckets.goals.currency,
            name: buckets.goals.name,
            cachedAt: new Date(),
          })
        }
        if (buckets.spending) {
          toCache.push({
            accountId: buckets.spending.id,
            balance: buckets.spending.balance,
            balanceAsOf: buckets.spending.balance_as_of,
            currency: buckets.spending.currency,
            name: buckets.spending.name,
            cachedAt: new Date(),
          })
        }
        await cacheBucketBalances(toCache)

        return {
          ...buckets,
          lastUpdated: new Date(),
        }
      } catch (error) {
        // On error, try to return cached data
        const cached = await getCachedBalances()
        if (cached.length > 0) {
          return {
            savings: cached.find(c => c.accountId === settings.savingsAccountId) as unknown as Asset,
            goals: cached.find(c => c.accountId === settings.goalsAccountId) as unknown as Asset,
            spending: cached.find(c => c.accountId === settings.spendingAccountId) as unknown as Asset,
            lastUpdated: cached[0]?.cachedAt ?? new Date(),
          }
        }
        throw error
      }
    },
    enabled: Boolean(settings?.lunchMoneyToken),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useSpendingTransactions() {
  const { data: settings } = useSettings()

  return useQuery({
    queryKey: settings?.lunchMoneyToken && settings?.spendingAccountId
      ? queryKeys.transactions(settings.lunchMoneyToken, settings.spendingAccountId)
      : ['transactions-disabled'],
    queryFn: async (): Promise<{ transactions: Transaction[]; lastUpdated: Date }> => {
      if (!settings?.lunchMoneyToken || !settings?.spendingAccountId) {
        // Try cache
        const cached = await getCachedTransactions(settings?.spendingAccountId ?? 0)
        if (cached.length > 0) {
          return {
            transactions: cached.map(c => ({
              id: c.id,
              date: c.date,
              payee: c.payee,
              amount: c.amount,
              currency: c.currency,
              category_name: c.categoryName,
              notes: null,
              category_id: null,
              asset_id: settings?.spendingAccountId ?? null,
              status: 'cleared',
            })),
            lastUpdated: cached[0]?.cachedAt ?? new Date(),
          }
        }
        throw new Error('No token configured')
      }

      try {
        const transactions = await getTransactions(
          settings.lunchMoneyToken,
          settings.spendingAccountId
        )

        // Cache transactions
        const toCache: CachedTransaction[] = transactions.map(t => ({
          id: t.id,
          accountId: settings.spendingAccountId,
          date: t.date,
          payee: t.payee,
          amount: t.amount,
          currency: t.currency,
          categoryName: t.category_name,
          cachedAt: new Date(),
        }))
        await cacheTransactions(toCache)

        return {
          transactions,
          lastUpdated: new Date(),
        }
      } catch (error) {
        // On error, return cached
        const cached = await getCachedTransactions(settings.spendingAccountId)
        if (cached.length > 0) {
          return {
            transactions: cached.map(c => ({
              id: c.id,
              date: c.date,
              payee: c.payee,
              amount: c.amount,
              currency: c.currency,
              category_name: c.categoryName,
              notes: null,
              category_id: null,
              asset_id: settings.spendingAccountId,
              status: 'cleared',
            })),
            lastUpdated: cached[0]?.cachedAt ?? new Date(),
          }
        }
        throw error
      }
    },
    enabled: Boolean(settings?.lunchMoneyToken && settings?.spendingAccountId),
    staleTime: 1000 * 60 * 5,
  })
}
