import { useTranslation } from 'react-i18next'
import { type Transaction } from '../lib/api'

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
}

export function TransactionList({ transactions, limit = 5 }: TransactionListProps) {
  const { t } = useTranslation()

  // Sort by date descending (latest first)
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const displayTransactions = sorted.slice(0, limit)

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center text-spending-subtitle text-sm py-2">
        {t('buckets.spending.noTransactions')}
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
  const { t, i18n } = useTranslation()
  const amount = parseFloat(transaction.amount)
  // Lunch Money: positive = expense (debit), negative = income (credit)
  const isExpense = amount > 0
  const displayAmount = Math.abs(amount).toLocaleString(i18n.language, {
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
    dateDisplay = t('transactions.today')
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateDisplay = t('transactions.yesterday')
  } else {
    dateDisplay = date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex items-center justify-between bg-spending-icon/50 rounded-xl px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-spending-text truncate">
          {transaction.category_name || t('transactions.uncategorized')}
        </p>
        <p className="text-xs text-spending-subtitle truncate">
          {transaction.payee || t('transactions.unknown')} · {dateDisplay}
        </p>
      </div>
      <div className={`text-sm font-semibold ${isExpense ? 'text-spending-text' : 'text-success'}`}>
        {isExpense ? '-' : '+'}{displayAmount}
      </div>
    </div>
  )
}
