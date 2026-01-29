import { useTranslation } from 'react-i18next'

interface LastUpdatedProps {
  date: Date
  isRefetching?: boolean
}

export function LastUpdated({ date, isRefetching }: LastUpdatedProps) {
  const { t } = useTranslation()
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  let timeAgo: string
  if (diffMins < 1) {
    timeAgo = t('time.justNow')
  } else if (diffMins < 60) {
    timeAgo = t('time.minutesAgo', { n: diffMins })
  } else if (diffHours < 24) {
    timeAgo = t('time.hoursAgo', { n: diffHours })
  } else {
    timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
      {isRefetching && (
        <span className="animate-spin">🔄</span>
      )}
      <span>{t('time.updated', { time: timeAgo })}</span>
    </div>
  )
}
