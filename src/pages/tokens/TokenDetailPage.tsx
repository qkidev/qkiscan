import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { getToken, getTokenHolders, getTokenTransfers } from '@/api/tokens'
import { ApiError } from '@/api/client'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { AddressLink } from '@/components/common/AddressLink'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'
import { formatWeiToDecimal } from '@/utils/number'

const TABS = ['transfers', 'holders'] as const
type TabId = (typeof TABS)[number]

function isTab(s: string | null): s is TabId {
  return s !== null && (TABS as readonly string[]).includes(s)
}

function formatHolderValue(value: string | null, decimals: number | null): string {
  if (value == null || value === '') return '—'
  if (decimals == null || !Number.isFinite(decimals) || decimals < 0) return value
  // 仅当是最小单位整数字符串时做换算，避免对已带小数的值重复处理
  if (/^-?\d+$/.test(value)) {
    return formatWeiToDecimal(value, Math.floor(decimals), 18)
  }
  return value
}

export function TokenDetailPage() {
  const { address = '' } = useParams<{ address: string }>()
  const { t } = useTranslation(['token', 'common'])
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const tab: TabId = isTab(rawTab) ? rawTab : 'transfers'

  const detailQuery = useQuery({
    queryKey: ['tokens', 'detail', address],
    queryFn: () => getToken(address),
    enabled: Boolean(address),
  })

  const trPg = useKeysetPagination()
  const trQuery = useQuery({
    queryKey: ['tokens', address, 'transfers', stableStringifyParams(trPg.requestCursor)],
    queryFn: () => getTokenTransfers(address, trPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'transfers',
  })

  const hPg = useKeysetPagination()
  const hQuery = useQuery({
    queryKey: ['tokens', address, 'holders', stableStringifyParams(hPg.requestCursor)],
    queryFn: () => getTokenHolders(address, hPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'holders',
  })

  function setTab(next: TabId) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', next)
    setSearchParams(nextParams, { replace: true })
  }

  if (!address) {
    return <EmptyState title={t('common:state.notFound')} />
  }

  if (detailQuery.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (detailQuery.isError) {
    const err = detailQuery.error
    if (err instanceof ApiError && err.status === 404) {
      return <EmptyState title={t('common:state.notFound')} />
    }
    return <ErrorState error={detailQuery.error} onRetry={() => void detailQuery.refetch()} />
  }

  const tok = detailQuery.data

  function renderTransferAmountWithSymbol(row: { amountRaw: string | null; tokenSymbol: string | null; tokenAddress: string | null }) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('token:detailTitle')}</h1>
        <p className="mt-1 break-all text-sm">
          <AddressLink address={tok.address} shorten={false} />
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:name')}</dt>
          <dd className="mt-1">{tok.name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:symbol')}</dt>
          <dd className="mt-1">{tok.symbol ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:decimals')}</dt>
          <dd className="mt-1">{tok.decimals ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:totalSupply')}</dt>
          <dd className="mt-1 break-all font-mono text-xs">{tok.totalSupply ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:holders')}</dt>
          <dd className="mt-1">{tok.holdersCount ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('token:transfers')}</dt>
          <dd className="mt-1">{tok.transfersCount ?? '—'}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {(
          [
            ['transfers', t('token:tabs.transfers')],
            ['holders', t('token:tabs.holders')],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={clsx(
              'rounded-full px-3 py-1 text-sm',
              tab === id ? 'bg-accent text-white' : 'bg-surface-muted text-slate-700 dark:text-slate-200',
            )}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'transfers' ? (
        trQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : trQuery.isError ? (
          <ErrorState error={trQuery.error} onRetry={() => void trQuery.refetch()} />
        ) : trQuery.data.items.length === 0 ? (
          <EmptyState title={t('common:state.empty')} />
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {trQuery.data.items.map((row, i) => (
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
                  <div className="mt-2 text-xs">{renderTransferAmountWithSymbol(row)}</div>
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
                  {trQuery.data.items.map((row, i) => (
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
                      <td className="px-3 py-2 text-xs">{renderTransferAmountWithSymbol(row)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              hasPrev={trPg.canGoPrev}
              hasNext={keysetHasNext(trQuery.data.nextPageParams)}
              onPrev={trPg.goPrev}
              onNext={() => trPg.goNext(trQuery.data.nextPageParams)}
            />
          </>
        )
      ) : null}

      {tab === 'holders' ? (
        hQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : hQuery.isError ? (
          <ErrorState error={hQuery.error} onRetry={() => void hQuery.refetch()} />
        ) : hQuery.data.items.length === 0 ? (
          <EmptyState title={t('common:state.empty')} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Address</th>
                    <th className="px-3 py-2">{t('common:table.value')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hQuery.data.items.map((row) => (
                    <tr key={row.address} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <AddressLink address={row.address} shorten={false} />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{formatHolderValue(row.value, tok.decimals)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              hasPrev={hPg.canGoPrev}
              hasNext={keysetHasNext(hQuery.data.nextPageParams)}
              onPrev={hPg.goPrev}
              onNext={() => hPg.goNext(hQuery.data.nextPageParams)}
            />
          </>
        )
      ) : null}
    </div>
  )
}
