import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBlock, getBlockTransactions } from '@/api/blocks'
import { ApiError } from '@/api/client'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'
import { Amount } from '@/components/common/Amount'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'
import type { ReactNode } from 'react'

export function BlockDetailPage() {
  const { heightOrHash = '' } = useParams<{ heightOrHash: string }>()
  const { t } = useTranslation(['block', 'common', 'tx'])
  const pg = useKeysetPagination()

  const blockQuery = useQuery({
    queryKey: ['blocks', 'detail', heightOrHash],
    queryFn: () => getBlock(heightOrHash),
    enabled: Boolean(heightOrHash),
  })

  const txsQuery = useQuery({
    queryKey: ['blocks', heightOrHash, 'txs', stableStringifyParams(pg.requestCursor)],
    queryFn: () => getBlockTransactions(heightOrHash, pg.requestCursor ?? undefined),
    enabled: Boolean(heightOrHash) && blockQuery.isSuccess,
  })

  if (!heightOrHash) {
    return <EmptyState title={t('common:state.notFound')} />
  }

  if (blockQuery.isPending) {
    return <Loading label={t('common:state.loading')} />
  }

  if (blockQuery.isError) {
    const err = blockQuery.error
    if (err instanceof ApiError && err.status === 404) {
      return <EmptyState title={t('common:state.notFound')} />
    }
    return <ErrorState error={blockQuery.error} onRetry={() => void blockQuery.refetch()} />
  }

  const b = blockQuery.data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t('block:detailTitle')} #{b.height}
        </h1>
      </div>

      <dl className="grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
        <DetailRow label={t('block:hash')} value={<HashText hash={b.hash} />} />
        <DetailRow label={t('block:timestamp')} value={<Timestamp iso={b.timestampIso} />} />
        <DetailRow label={t('block:parentHash')} value={<HashText hash={b.parentHash} to={b.parentHash ? `/blocks/${b.parentHash}` : undefined} />} />
        <DetailRow label={t('block:txCount')} value={b.txCount ?? '—'} />
        <DetailRow label={t('block:gasLimit')} value={b.gasLimit ?? '—'} />
        <DetailRow label={t('block:gasUsed')} value={b.gasUsed ?? '—'} />
        <DetailRow label={t('block:baseFee')} value={b.baseFeePerGas ?? '—'} />
        <DetailRow label={t('block:burntFees')} value={b.burntFees ?? '—'} />
        <DetailRow
          label={t('block:miner')}
          value={
            b.minerAddress ? (
              <span className="flex flex-wrap items-center gap-2">
                <AddressLink address={b.minerAddress} shorten={false} />
                {b.minerName ? <span className="text-slate-500">({b.minerName})</span> : null}
              </span>
            ) : (
              '—'
            )
          }
        />
      </dl>

      <section>
        <h2 className="mb-3 text-lg font-medium">{t('block:blockTxs')}</h2>
        {txsQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : txsQuery.isError ? (
          <ErrorState error={txsQuery.error} onRetry={() => void txsQuery.refetch()} />
        ) : txsQuery.data.items.length === 0 ? (
          <EmptyState title={t('common:state.empty')} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{t('common:table.tx')}</th>
                    <th className="px-3 py-2">{t('common:table.status')}</th>
                    <th className="px-3 py-2">{t('common:table.from')}</th>
                    <th className="hidden px-3 py-2 md:table-cell">{t('common:table.to')}</th>
                    <th className="px-3 py-2">{t('common:table.value')}</th>
                  </tr>
                </thead>
                <tbody>
                  {txsQuery.data.items.map((tx) => (
                    <tr key={tx.hash} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <HashText hash={tx.hash} to={`/tx/${tx.hash}`} />
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-3 py-2">
                        <AddressLink address={tx.from} label={tx.fromName} />
                      </td>
                      <td className="hidden px-3 py-2 md:table-cell">
                        <AddressLink address={tx.to} label={tx.toName} />
                      </td>
                      <td className="px-3 py-2">
                        <Amount wei={tx.valueWei} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              hasPrev={pg.canGoPrev}
              hasNext={keysetHasNext(txsQuery.data.nextPageParams)}
              onPrev={pg.goPrev}
              onNext={() => pg.goNext(txsQuery.data.nextPageParams)}
            />
          </>
        )}
      </section>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 break-all font-mono text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  )
}
