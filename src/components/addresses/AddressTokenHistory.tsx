import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { getAddressTokenTransfers } from '@/api/addresses'
import type { ExplorerTokenTransferVM } from '@/api/view-models'
import { AddressLink } from '@/components/common/AddressLink'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { HashText } from '@/components/common/HashText'
import { Loading } from '@/components/common/Loading'
import { PaginationControls } from '@/components/common/PaginationControls'
import { Timestamp } from '@/components/common/Timestamp'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { keysetHasNext, stableStringifyParams } from '@/utils/query'

type Direction = 'in' | 'out' | 'self'

function transferDirection(holder: string, from: string | null, to: string | null): Direction | null {
  const holderKey = holder.toLowerCase()
  const fromKey = from?.toLowerCase()
  const toKey = to?.toLowerCase()
  if (fromKey === holderKey && toKey === holderKey) return 'self'
  if (toKey === holderKey) return 'in'
  if (fromKey === holderKey) return 'out'
  return null
}

function TransferAmount({ row }: { row: ExplorerTokenTransferVM }) {
  const amount = row.amountRaw ?? '—'
  const symbol = row.tokenSymbol ?? row.tokenAddress
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

function DirectionBadge({ direction }: { direction: Direction | null }) {
  const { t } = useTranslation('address')
  if (!direction) return <span>—</span>
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2 py-0.5 text-xs',
        direction === 'in' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
        direction === 'out' && 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
        direction === 'self' && 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      )}
    >
      {t(`tokenHistory.${direction}`)}
    </span>
  )
}

/** 某个地址持有的单个代币的转账明细 */
export function AddressTokenHistory({
  holderAddress,
  tokenAddress,
  tokenLabel,
  onClose,
}: {
  holderAddress: string
  tokenAddress: string
  tokenLabel: string
  onClose: () => void
}) {
  const { t } = useTranslation(['address', 'common'])
  const sectionRef = useRef<HTMLElement>(null)
  const pg = useKeysetPagination()
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])
  const query = useQuery({
    queryKey: [
      'addresses',
      holderAddress,
      'token-transfers',
      tokenAddress.toLowerCase(),
      stableStringifyParams(pg.requestCursor),
    ],
    queryFn: () => getAddressTokenTransfers(holderAddress, pg.requestCursor ?? undefined, { token: tokenAddress }),
    enabled: Boolean(holderAddress) && Boolean(tokenAddress),
  })

  return (
    <section ref={sectionRef} className="space-y-3 rounded-lg border border-border border-l-4 border-l-accent bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{t('address:tokenHistory.title', { symbol: tokenLabel })}</h2>
        <button
          type="button"
          className="rounded-full bg-surface px-3 py-1 text-sm text-slate-700 dark:text-slate-200"
          onClick={onClose}
        >
          {t('address:tokenHistory.close')}
        </button>
      </div>

      {query.isPending ? <Loading label={t('common:state.loading')} /> : null}
      {query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : null}
      {query.isSuccess && query.data.items.length === 0 ? <EmptyState title={t('common:state.empty')} /> : null}

      {query.isSuccess && query.data.items.length > 0 ? (
        <>
          <div className="space-y-3 md:hidden">
            {query.data.items.map((row, i) => (
              <div key={`${row.transactionHash}-${i}`} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
                  <Timestamp iso={row.timestampIso} format="absolute" />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <DirectionBadge direction={transferDirection(holderAddress, row.from, row.to)} />
                  <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {row.method ?? '—'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <AddressLink address={row.from} label={row.fromName} />
                  <span className="text-slate-400">→</span>
                  <AddressLink address={row.to} label={row.toName} />
                </div>
                <div className="mt-2 text-xs">
                  <TransferAmount row={row} />
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
                  <th className="px-3 py-2">{t('address:tokenHistory.direction')}</th>
                  <th className="px-3 py-2">{t('common:table.method')}</th>
                  <th className="px-3 py-2">{t('common:table.from')}</th>
                  <th className="px-3 py-2">{t('common:table.to')}</th>
                  <th className="px-3 py-2">{t('common:table.value')}</th>
                </tr>
              </thead>
              <tbody>
                {query.data.items.map((row, i) => (
                  <tr key={`${row.transactionHash}-${i}`} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">
                      <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Timestamp iso={row.timestampIso} format="absolute" />
                    </td>
                    <td className="px-3 py-2">
                      <DirectionBadge direction={transferDirection(holderAddress, row.from, row.to)} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{row.method ?? '—'}</td>
                    <td className="px-3 py-2">
                      <AddressLink address={row.from} label={row.fromName} />
                    </td>
                    <td className="px-3 py-2">
                      <AddressLink address={row.to} label={row.toName} />
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <TransferAmount row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            hasPrev={pg.canGoPrev}
            hasNext={keysetHasNext(query.data.nextPageParams)}
            onPrev={pg.goPrev}
            onNext={() => pg.goNext(query.data.nextPageParams)}
          />
        </>
      ) : null}
    </section>
  )
}
