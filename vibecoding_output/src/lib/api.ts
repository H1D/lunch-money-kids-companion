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

// Unified account type (combines assets and plaid_accounts)
export interface Account {
  id: number
  name: string
  balance: string
  balance_as_of: string
  currency: string
  type_name: string
  subtype_name: string | null
  institution_name: string | null
  source: 'asset' | 'plaid'
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
  plaid_account_id: number | null
  status: string
}

interface AssetRaw {
  id: number
  name: string
  balance: string
  balance_as_of: string
  currency: string
  type_name: string
  subtype_name: string | null
  institution_name: string | null
}

interface PlaidAccountRaw {
  id: number
  name: string
  display_name: string
  balance: string
  balance_last_update: string
  currency: string
  type: string
  subtype: string
  institution_name: string | null
}

interface AssetsResponse {
  assets: AssetRaw[]
}

interface PlaidAccountsResponse {
  plaid_accounts: PlaidAccountRaw[]
}

interface TransactionsResponse {
  transactions: Transaction[]
}

/**
 * Fetch all manual assets - GET only
 */
async function getManualAssets(token: string): Promise<Account[]> {
  const response = await safeFetch('/assets', token, 'GET')
  const data: AssetsResponse = await response.json()
  return data.assets.map(a => ({
    ...a,
    source: 'asset' as const,
  }))
}

/**
 * Fetch all Plaid-linked accounts - GET only
 */
async function getPlaidAccounts(token: string): Promise<Account[]> {
  const response = await safeFetch('/plaid_accounts', token, 'GET')
  const data: PlaidAccountsResponse = await response.json()
  return data.plaid_accounts.map(p => ({
    id: p.id,
    name: p.display_name || p.name,
    balance: p.balance,
    balance_as_of: p.balance_last_update,
    currency: p.currency,
    type_name: p.type,
    subtype_name: p.subtype,
    institution_name: p.institution_name,
    source: 'plaid' as const,
  }))
}

/**
 * Fetch ALL accounts (manual assets + Plaid-linked) - GET only
 */
export async function getAllAccounts(token: string): Promise<Account[]> {
  const [assets, plaidAccounts] = await Promise.all([
    getManualAssets(token),
    getPlaidAccounts(token),
  ])
  return [...assets, ...plaidAccounts]
}

/**
 * Fetch a single account by ID - GET only
 */
export async function getAccount(token: string, accountId: number): Promise<Account | undefined> {
  const accounts = await getAllAccounts(token)
  return accounts.find(a => a.id === accountId)
}

/**
 * Fetch transactions for a specific account - GET only
 */
export async function getTransactions(
  token: string,
  accountId: number,
  startDate?: string,
  endDate?: string
): Promise<Transaction[]> {
  // Default to last 30 days
  const start = startDate ?? (() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().split('T')[0]
  })()
  const end = endDate ?? new Date().toISOString().split('T')[0]

  const params = new URLSearchParams({
    start_date: start,
    end_date: end,
  })

  const response = await safeFetch(`/transactions?${params.toString()}`, token, 'GET')
  const data: TransactionsResponse = await response.json()

  // Filter by account ID (could be asset_id or plaid_account_id)
  return data.transactions.filter(
    t => t.asset_id === accountId || t.plaid_account_id === accountId
  )
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
  savings: Account | undefined
  goals: Account | undefined
  spending: Account | undefined
}> {
  const accounts = await getAllAccounts(token)

  return {
    savings: accounts.find(a => a.id === savingsAccountId),
    goals: accounts.find(a => a.id === goalsAccountId),
    spending: accounts.find(a => a.id === spendingAccountId),
  }
}

// Re-export for backwards compatibility
export type Asset = Account
