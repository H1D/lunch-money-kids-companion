import { type Transaction } from '../lib/api'

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
}

export function TransactionList({ transactions, limit = 5 }: TransactionListProps) {
  // Sort by date descending (latest first)
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const displayTransactions = sorted.slice(0, limit)

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center text-emerald-700 text-sm py-2">
        No recent transactions
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {displayTransactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  )
}

interface TransactionItemProps {
  transaction: Transaction
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const amount = parseFloat(transaction.amount)
  // Lunch Money: positive = expense (debit), negative = income (credit)
  const isExpense = amount > 0
  const displayAmount = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: transaction.currency || 'EUR',
  })

  // Format date nicely
  const date = new Date(transaction.date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let dateDisplay: string
  if (date.toDateString() === today.toDateString()) {
    dateDisplay = 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateDisplay = 'Yesterday'
  } else {
    dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex items-center justify-between bg-emerald-100/50 rounded-xl px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-emerald-900 truncate">
          {transaction.category_name || 'Uncategorized'}
        </p>
        <p className="text-xs text-emerald-700 truncate">
          {transaction.payee || 'Unknown'} · {dateDisplay}
        </p>
      </div>
      <div className={`text-sm font-semibold ${isExpense ? 'text-emerald-800' : 'text-green-700'}`}>
        {isExpense ? '-' : '+'}{displayAmount}
      </div>
    </div>
  )
}
