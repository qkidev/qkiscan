import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBlocks } from '@/api/blocks'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'

export function BlocksPage() {
  const { t } = useTranslation(['block', 'common'])
  const { requestCursor, goNext, goPrev, canGoPrev } = useKeysetPagination()

  const query = useQuery({
    queryKey: ['blocks', 'list', stableStringifyParams(requestCursor)],
    queryFn: () => getBlocks(requestCursor ?? undefined),
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
      <h1 className="text-2xl font-semibold">{t('block:listTitle')}</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">{t('block:height')}</th>
              <th className="px-3 py-2">{t('common:table.hash')}</th>
              <th className="px-3 py-2">{t('common:table.time')}</th>
              <th className="px-3 py-2">{t('common:table.tx')}</th>
              <th className="hidden px-3 py-2 lg:table-cell">{t('common:table.gas')}</th>
              <th className="hidden px-3 py-2 xl:table-cell">{t('common:table.miner')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.hash} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono">
                  <Link className="text-accent" to={`/blocks/${b.height}`}>
                    {b.height}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <HashText hash={b.hash} to={`/blocks/${b.hash}`} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Timestamp iso={b.timestampIso} />
                </td>
                <td className="px-3 py-2 tabular-nums">{b.txCount ?? '—'}</td>
                <td className="hidden px-3 py-2 font-mono text-xs lg:table-cell">
                  {b.gasUsed ?? '—'} / {b.gasLimit ?? '—'}
                </td>
                <td className="hidden px-3 py-2 xl:table-cell">
                  <AddressLink address={b.minerAddress} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        hasPrev={canGoPrev}
        hasNext={keysetHasNext(nextPageParams)}
        onPrev={goPrev}
        onNext={() => goNext(nextPageParams)}
      />
    </div>
  )
}
