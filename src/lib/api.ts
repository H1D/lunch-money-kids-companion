/**
 * Read-only Lunch Money API wrapper
 * SECURITY: Only GET requests are allowed - all other methods are blocked
 */

const LUNCH_MONEY_API_BASE = 'https://dev.lunchmoney.app/v1'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Safe fetch wrapper that ONLY allows GET requests
 * Throws an error for any other HTTP method
 */
async function safeFetch(
  endpoint: string,
  token: string,
  method: HttpMethod = 'GET'
): Promise<Response> {
  // SECURITY: Block all non-GET requests
  if (method !== 'GET') {
    throw new Error(
      `SECURITY VIOLATION: Only GET requests are allowed. Attempted: ${method}`
    )
  }

  const url = `${LUNCH_MONEY_API_BASE}${endpoint}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Lunch Money API error: ${response.status} ${response.statusText}`)
  }

  return response
}

// Types based on Lunch Money API v2
export interface Asset {
  id: number
  name: string
  balance: string
  balance_as_of: string
  currency: string
  type_name: string
  subtype_name: string | null
  institution_name: string | null
}

export interface Transaction {
  id: number
  date: string
  payee: string
  amount: string
  currency: string
  notes: string | null
  category_id: number | null
  category_name: string | null
  asset_id: number | null
  status: string
}

export interface AssetsResponse {
  assets: Asset[]
}

export interface TransactionsResponse {
  transactions: Transaction[]
}

/**
 * Fetch all assets (accounts) - GET only
 */
export async function getAssets(token: string): Promise<Asset[]> {
  const response = await safeFetch('/assets', token, 'GET')
  const data: AssetsResponse = await response.json()
  return data.assets
}

/**
 * Fetch a single asset by ID - GET only
 */
export async function getAsset(token: string, assetId: number): Promise<Asset | undefined> {
  const assets = await getAssets(token)
  return assets.find(a => a.id === assetId)
}

/**
 * Fetch transactions for a specific asset - GET only
 */
export async function getTransactions(
  token: string,
  assetId: number,
  startDate?: string,
  endDate?: string
): Promise<Transaction[]> {
  const params = new URLSearchParams({
    asset_id: assetId.toString(),
  })

  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)

  // Default to last 30 days
  if (!startDate) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    params.append('start_date', thirtyDaysAgo.toISOString().split('T')[0])
  }
  if (!endDate) {
    params.append('end_date', new Date().toISOString().split('T')[0])
  }

  const response = await safeFetch(`/transactions?${params.toString()}`, token, 'GET')
  const data: TransactionsResponse = await response.json()
  return data.transactions
}

/**
 * Fetch balances for the three money buckets
 */
export async function getBucketBalances(
  token: string,
  savingsAccountId: number,
  goalsAccountId: number,
  spendingAccountId: number
): Promise<{
  savings: Asset | undefined
  goals: Asset | undefined
  spending: Asset | undefined
}> {
  const assets = await getAssets(token)

  return {
    savings: assets.find(a => a.id === savingsAccountId),
    goals: assets.find(a => a.id === goalsAccountId),
    spending: assets.find(a => a.id === spendingAccountId),
  }
}
