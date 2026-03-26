import clsx from 'clsx'
import type { ExplorerTransactionListItemVM } from '@/api/view-models'
import { useTranslation } from 'react-i18next'

type Status = ExplorerTransactionListItemVM['status']

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useTranslation('common')
  const label =
    status === 'ok'
      ? t('status.ok')
      : status === 'fail'
        ? t('status.fail')
        : status === 'pending'
          ? t('status.pending')
          : t('status.unknown')
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'ok' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
        status === 'fail' && 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        status === 'pending' && 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100',
        status === 'unknown' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      )}
    >
      {label}
    </span>
  )
}
