import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTokens } from '@/api/tokens'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'
import { AddressLink } from '@/components/common/AddressLink'

export function TokensPage() {
  const { t } = useTranslation(['token', 'common'])
  const pg = useKeysetPagination()

  const query = useQuery({
    queryKey: ['tokens', 'list', stableStringifyParams(pg.requestCursor)],
    queryFn: () => getTokens(pg.requestCursor ?? undefined),
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
      <h1 className="text-2xl font-semibold">{t('token:listTitle')}</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">{t('token:name')}</th>
              <th className="px-3 py-2">{t('token:contractAddress')}</th>
              <th className="px-3 py-2">{t('token:symbol')}</th>
              <th className="px-3 py-2">{t('token:holders')}</th>
              <th className="px-3 py-2">{t('token:transfers')}</th>
              <th className="px-3 py-2">{t('token:totalSupply')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.address} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <Link className="text-accent" to={`/token/${row.address}`}>
                    {row.name ?? row.address}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <AddressLink address={row.address} />
                </td>
                <td className="px-3 py-2">{row.symbol ?? '—'}</td>
                <td className="px-3 py-2 tabular-nums">{row.holders ?? '—'}</td>
                <td className="px-3 py-2 tabular-nums">{row.transfers ?? '—'}</td>
                <td className="px-3 py-2 font-mono text-xs break-all">{row.totalSupply ?? '—'}</td>
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
