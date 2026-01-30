import { test as base, type Page } from '@playwright/test'

/**
 * Mock data for e2e tests
 * These values are used to seed IndexedDB so the app shows the dashboard
 */
export const mockSettings = {
  id: 1,
  lunchMoneyToken: 'test-token-for-e2e',
  savingsAccountId: 1001,
  goalsAccountId: 1002,
  spendingAccountId: 1003,
  updatedAt: new Date(),
}

export const mockBalances = [
  {
    accountId: 1001,
    balance: '1500.00',
    balanceAsOf: new Date().toISOString(),
    currency: 'EUR',
    name: 'Long-term Savings',
    cachedAt: new Date(),
  },
  {
    accountId: 1002,
    balance: '350.00',
    balanceAsOf: new Date().toISOString(),
    currency: 'EUR',
    name: 'Goal Savings',
    cachedAt: new Date(),
  },
  {
    accountId: 1003,
    balance: '75.50',
    balanceAsOf: new Date().toISOString(),
    currency: 'EUR',
    name: 'Free Spending',
    cachedAt: new Date(),
  },
]

export const mockTransactions = [
  {
    id: 1,
    accountId: 1003,
    date: new Date().toISOString().split('T')[0],
    payee: 'Allowance',
    amount: '25.00',
    currency: 'EUR',
    categoryName: 'Income',
    cachedAt: new Date(),
  },
  {
    id: 2,
    accountId: 1003,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    payee: 'Candy Store',
    amount: '-5.50',
    currency: 'EUR',
    categoryName: 'Treats',
    cachedAt: new Date(),
  },
]

/**
 * Seeds IndexedDB with mock data so the app shows the dashboard
 */
export async function seedMockData(page: Page) {
  await page.evaluate(
    ({ settings, balances, transactions }) => {
      return new Promise<void>((resolve, reject) => {
        // Open without version to use existing schema
        const request = indexedDB.open('KidsLunchMoney')

        request.onerror = () => reject(request.error)

        request.onsuccess = () => {
          const db = request.result

          // Check if stores exist
          if (!db.objectStoreNames.contains('settings')) {
            db.close()
            reject(new Error('Database schema not ready - settings store missing'))
            return
          }

          const tx = db.transaction(
            ['settings', 'cachedBalances', 'cachedTransactions'],
            'readwrite'
          )

          tx.onerror = () => reject(tx.error)
          tx.oncomplete = () => {
            db.close()
            resolve()
          }

          // Add settings
          tx.objectStore('settings').put(settings)

          // Add balances
          const balanceStore = tx.objectStore('cachedBalances')
          for (const balance of balances) {
            balanceStore.put(balance)
          }

          // Add transactions
          const txStore = tx.objectStore('cachedTransactions')
          for (const transaction of transactions) {
            txStore.put(transaction)
          }
        }
      })
    },
    {
      settings: mockSettings,
      balances: mockBalances,
      transactions: mockTransactions,
    }
  )
}

/**
 * Clears IndexedDB to simulate first-time user
 */
export async function clearMockData(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('KidsLunchMoney')
      request.onsuccess = () => resolve()
      request.onerror = () => resolve()
      request.onblocked = () => resolve()
    })
  })
}

/**
 * Extended test fixture that seeds mock data before each test
 */
export const test = base.extend<{ configuredPage: Page }>({
  configuredPage: async ({ page }, use) => {
    // Step 1: Go to page first
    await page.goto('/')

    // Step 2: Delete existing database
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const deleteReq = indexedDB.deleteDatabase('KidsLunchMoney')
        deleteReq.onsuccess = () => resolve()
        deleteReq.onerror = () => resolve()
        deleteReq.onblocked = () => resolve()
      })
    })

    // Step 3: Reload so Dexie creates fresh schema
    await page.reload()

    // Step 4: Wait for welcome screen (confirms Dexie initialized)
    await page.waitForSelector('text=Lunch Money Kids', { timeout: 10000 })

    // Step 5: Seed the mock data
    await seedMockData(page)

    // Step 6: Navigate fresh to pick up the seeded settings
    await page.goto('/', { waitUntil: 'networkidle' })

    // Step 7: Wait for dashboard
    await page.waitForSelector('h1:has-text("My Money")', { timeout: 15000 })

    // Provide the page to the test
    await use(page)
  },
})

export { expect } from '@playwright/test'
