import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAllTokenTransfers } from '@/api/tokens'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext, stableStringifyParams } from '@/utils/query'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'

export function TokenTransfersPage() {
  const { t } = useTranslation(['common', 'token'])
  const pg = useKeysetPagination()

  const query = useQuery({
    queryKey: ['token-transfers', stableStringifyParams(pg.requestCursor)],
    queryFn: () => getAllTokenTransfers(pg.requestCursor ?? undefined),
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

  function renderAmountWithSymbol(row: (typeof items)[number]) {
    const amount = row.amountRaw ?? '—'
    const symbol = row.tokenSymbol ?? (row.tokenAddress ? row.tokenAddress : null)
    if (!symbol) return <span className="font-mono">{amount}</span>
    if (!row.tokenAddress) return <span className="font-mono">{`${amount} ${symbol}`}</span>
    return (
      <span className="font-mono">
        {amount}{' '}
        <Link className="text-accent" to={`/token/${row.tokenAddress}`}>
          {symbol}
        </Link>
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('common:nav.tokenTransfers')}</h1>
      <div className="space-y-3 md:hidden">
        {items.map((row, i) => (
          <div key={`${row.transactionHash}-${i}`} className="rounded-lg border border-border bg-surface p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
              <Timestamp iso={row.timestampIso} />
            </div>
            <div className="mt-2 text-xs">
              <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {row.method ?? '—'}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <AddressLink address={row.from} />
              <span className="text-slate-400">→</span>
              <AddressLink address={row.to} />
            </div>
            <div className="mt-2 text-xs">
              {renderAmountWithSymbol(row)}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">{t('common:table.tx')}</th>
              <th className="px-3 py-2">{t('common:table.time')}</th>
              <th className="px-3 py-2">{t('common:table.method')}</th>
              <th className="px-3 py-2">{t('common:table.from')}</th>
              <th className="px-3 py-2">{t('common:table.to')}</th>
              <th className="px-3 py-2">{t('common:table.value')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={`${row.transactionHash}-${i}`} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Timestamp iso={row.timestampIso} />
                </td>
                <td className="px-3 py-2 font-mono text-xs">{row.method ?? '—'}</td>
                <td className="px-3 py-2">
                  <AddressLink address={row.from} />
                </td>
                <td className="px-3 py-2">
                  <AddressLink address={row.to} />
                </td>
                <td className="px-3 py-2 text-xs">{renderAmountWithSymbol(row)}</td>
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
