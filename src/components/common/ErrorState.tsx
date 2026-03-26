import { useTranslation } from 'react-i18next'
import { ApiError } from '@/api/client'

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown
  onRetry?: () => void
}) {
  const { t } = useTranslation('common')
  const status = error instanceof ApiError ? error.status : 0
  const is429 = status === 429
  const message = is429 ? t('state.rateLimited') : error instanceof Error ? error.message : t('state.error')

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
      <p className="text-sm font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          onClick={onRetry}
        >
          {t('state.retry')}
        </button>
      ) : null}
    </div>
  )
}
