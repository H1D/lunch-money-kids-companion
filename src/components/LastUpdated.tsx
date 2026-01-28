interface LastUpdatedProps {
  date: Date
  isRefetching?: boolean
}

export function LastUpdated({ date, isRefetching }: LastUpdatedProps) {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  let timeAgo: string
  if (diffMins < 1) {
    timeAgo = 'Just now'
  } else if (diffMins < 60) {
    timeAgo = `${diffMins}m ago`
  } else if (diffHours < 24) {
    timeAgo = `${diffHours}h ago`
  } else {
    timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-white/40">
      {isRefetching && (
        <span className="animate-spin">🔄</span>
      )}
      <span>Updated {timeAgo}</span>
    </div>
  )
}
