import { useTranslation } from 'react-i18next'

export function PaginationControls({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  onPrev?: () => void
  onNext?: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const { t } = useTranslation('common')
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        disabled={!hasPrev}
        className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm disabled:opacity-40"
        onClick={onPrev}
      >
        {t('pagination.prev')}
      </button>
      <button
        type="button"
        disabled={!hasNext}
        className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm disabled:opacity-40"
        onClick={onNext}
      >
        {t('pagination.next')}
      </button>
    </div>
  )
}
