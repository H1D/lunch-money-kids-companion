import Dexie, { type EntityTable } from 'dexie'

/**
 * Settings stored by parent (protected)
 */
export interface Settings {
  id: number // Always 1 (singleton)
  lunchMoneyToken: string
  savingsAccountId: number
  goalsAccountId: number
  spendingAccountId: number
  updatedAt: Date
}

/**
 * Financial goals created by child
 */
export interface Goal {
  id?: number
  name: string
  targetAmount: number
  iconEmoji?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Child's preferences
 */
export interface Preferences {
  id: number // Always 1 (singleton)
  themeHue: number // 0-360 hue value
  locale: string | null // null = auto-detect from browser
  updatedAt: Date
}

/**
 * Cached data from Lunch Money API
 */
export interface CachedBalance {
  accountId: number
  balance: string
  balanceAsOf: string
  currency: string
  name: string
  cachedAt: Date
}

export interface CachedTransaction {
  id: number
  accountId: number
  date: string
  payee: string
  amount: string
  currency: string
  categoryName: string | null
  cachedAt: Date
}

/**
 * Dexie database instance
 */
const db = new Dexie('KidsLunchMoney') as Dexie & {
  settings: EntityTable<Settings, 'id'>
  goals: EntityTable<Goal, 'id'>
  preferences: EntityTable<Preferences, 'id'>
  cachedBalances: EntityTable<CachedBalance, 'accountId'>
  cachedTransactions: EntityTable<CachedTransaction, 'id'>
}

db.version(1).stores({
  settings: 'id', // Singleton
  goals: '++id, name, createdAt',
  preferences: 'id', // Singleton
  cachedBalances: 'accountId, cachedAt',
  cachedTransactions: 'id, accountId, date, cachedAt',
})

export { db }

// Helper functions

export async function getSettings(): Promise<Settings | undefined> {
  return db.settings.get(1)
}

export async function saveSettings(settings: Omit<Settings, 'id' | 'updatedAt'>): Promise<void> {
  await db.settings.put({
    ...settings,
    id: 1,
    updatedAt: new Date(),
  })
}

export async function getPreferences(): Promise<Preferences> {
  const prefs = await db.preferences.get(1)
  if (!prefs) {
    return { id: 1, themeHue: 220, locale: null, updatedAt: new Date() }
  }
  // Backward compat: migrate old theme string to hue
  if ('theme' in prefs && typeof (prefs as { theme?: string }).theme === 'string') {
    const oldThemeMap: Record<string, number> = {
      default: 220, classic: 220, ocean: 210, forest: 145,
      sunset: 25, candy: 330, lavender: 275, lemon: 65
    }
    const oldTheme = (prefs as { theme: string }).theme
    return { id: 1, themeHue: oldThemeMap[oldTheme] ?? 220, locale: null, updatedAt: prefs.updatedAt }
  }
  // Ensure locale field exists (for old prefs without it)
  return { ...prefs, locale: prefs.locale ?? null }
}

export async function savePreferences(prefs: Partial<Omit<Preferences, 'id' | 'updatedAt'>>): Promise<void> {
  const existing = await getPreferences()
  await db.preferences.put({
    ...existing,
    ...prefs,
    id: 1,
    updatedAt: new Date(),
  })
}

export async function getGoals(): Promise<Goal[]> {
  return db.goals.orderBy('createdAt').toArray()
}

export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date()
  const id = await db.goals.add({
    ...goal,
    createdAt: now,
    updatedAt: now,
  })
  return id as number
}

export async function updateGoal(id: number, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<void> {
  await db.goals.update(id, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteGoal(id: number): Promise<void> {
  await db.goals.delete(id)
}

export async function cacheBucketBalances(balances: CachedBalance[]): Promise<void> {
  const now = new Date()
  await db.cachedBalances.bulkPut(
    balances.map(b => ({ ...b, cachedAt: now }))
  )
}

export async function getCachedBalances(): Promise<CachedBalance[]> {
  return db.cachedBalances.toArray()
}

export async function cacheTransactions(transactions: CachedTransaction[]): Promise<void> {
  const now = new Date()
  await db.cachedTransactions.bulkPut(
    transactions.map(t => ({ ...t, cachedAt: now }))
  )
}

export async function getCachedTransactions(accountId: number): Promise<CachedTransaction[]> {
  return db.cachedTransactions
    .where('accountId')
    .equals(accountId)
    .reverse()
    .sortBy('date')
}
