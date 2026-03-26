import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTransactions } from '@/api/transactions'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'
import { Amount } from '@/components/common/Amount'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'

export function TransactionsPage() {
  const { t } = useTranslation(['tx', 'common'])
  const pg = useKeysetPagination()

  const query = useQuery({
    queryKey: ['transactions', 'list', stableStringifyParams(pg.requestCursor)],
    queryFn: () => getTransactions(pg.requestCursor ?? undefined),
  })

  if (query.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }

  const { items, nextPageParams } = query.data
  if (items.length === 0) {
    return <EmptyState title={t('common:state.empty')} />
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('tx:listTitle')}</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">{t('common:table.tx')}</th>
              <th className="px-3 py-2">{t('common:table.status')}</th>
              <th className="px-3 py-2">{t('common:table.block')}</th>
              <th className="px-3 py-2">{t('common:table.time')}</th>
              <th className="hidden px-3 py-2 md:table-cell">{t('common:table.from')}</th>
              <th className="hidden px-3 py-2 lg:table-cell">{t('common:table.to')}</th>
              <th className="px-3 py-2">{t('common:table.value')}</th>
              <th className="hidden px-3 py-2 xl:table-cell">{t('common:table.fee')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx.hash} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <HashText hash={tx.hash} to={`/tx/${tx.hash}`} />
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-3 py-2 font-mono">
                  {tx.blockNumber ? (
                    <Link className="text-accent" to={`/blocks/${tx.blockNumber}`}>
                      {tx.blockNumber}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Timestamp iso={tx.timestampIso} />
                </td>
                <td className="hidden px-3 py-2 md:table-cell">
                  <AddressLink address={tx.from} />
                </td>
                <td className="hidden px-3 py-2 lg:table-cell">
                  <AddressLink address={tx.to} />
                </td>
                <td className="px-3 py-2">
                  <Amount wei={tx.valueWei} />
                </td>
                <td className="hidden px-3 py-2 font-mono text-xs xl:table-cell">{tx.fee ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        hasPrev={pg.canGoPrev}
        hasNext={keysetHasNext(nextPageParams)}
        onPrev={pg.goPrev}
        onNext={() => pg.goNext(nextPageParams)}
      />
    </div>
  )
}
