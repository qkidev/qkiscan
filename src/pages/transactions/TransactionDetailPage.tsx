import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import {
  getTransaction,
  getTransactionInternalTxs,
  getTransactionLogs,
  getTransactionStateChanges,
  getTransactionTokenTransfers,
} from '@/api/transactions'
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
import { formatWeiToGwei } from '@/utils/number'
import { FormattedJson } from '@/components/common/FormattedJson'
import type { ReactNode } from 'react'

const TABS = ['overview', 'token-transfers', 'logs', 'internal', 'state'] as const
type TabId = (typeof TABS)[number]

function isTab(s: string | null): s is TabId {
  return s !== null && (TABS as readonly string[]).includes(s)
}

export function TransactionDetailPage() {
  const { hash = '' } = useParams<{ hash: string }>()
  const { t } = useTranslation(['tx', 'common'])
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const tab: TabId = isTab(rawTab) ? rawTab : 'overview'

  const detailQuery = useQuery({
    queryKey: ['transactions', 'detail', hash],
    queryFn: () => getTransaction(hash),
    enabled: Boolean(hash),
  })

  const ttPg = useKeysetPagination()
  const tokenTransfersQuery = useQuery({
    queryKey: ['transactions', hash, 'token-transfers', stableStringifyParams(ttPg.requestCursor)],
    queryFn: () => getTransactionTokenTransfers(hash, ttPg.requestCursor ?? undefined),
    enabled: Boolean(hash) && tab === 'token-transfers',
  })

  const logsPg = useKeysetPagination()
  const logsQuery = useQuery({
    queryKey: ['transactions', hash, 'logs', stableStringifyParams(logsPg.requestCursor)],
    queryFn: () => getTransactionLogs(hash, logsPg.requestCursor ?? undefined),
    enabled: Boolean(hash) && tab === 'logs',
  })

  const intPg = useKeysetPagination()
  const internalQuery = useQuery({
    queryKey: ['transactions', hash, 'internal', stableStringifyParams(intPg.requestCursor)],
    queryFn: () => getTransactionInternalTxs(hash, intPg.requestCursor ?? undefined),
    enabled: Boolean(hash) && tab === 'internal',
  })

  const stateQuery = useQuery({
    queryKey: ['transactions', hash, 'state-changes'],
    queryFn: () => getTransactionStateChanges(hash),
    enabled: Boolean(hash) && tab === 'state',
  })

  function setTab(next: TabId) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', next)
    setSearchParams(nextParams, { replace: true })
  }

  if (!hash) {
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

  const tx = detailQuery.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('tx:detailTitle')}</h1>
        <p className="mt-2 break-all font-mono text-sm text-slate-600 dark:text-slate-300">{tx.hash}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {(
          [
            ['overview', t('tx:tabs.overview')],
            ['token-transfers', t('tx:tabs.tokenTransfers')],
            ['logs', t('tx:tabs.logs')],
            ['internal', t('tx:tabs.internal')],
            ['state', t('tx:tabs.state')],
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

      {tab === 'overview' ? (
        <dl className="grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
          <DetailRow label={t('common:table.status')} value={<StatusBadge status={tx.status} />} />
          <DetailRow
            label={t('common:table.block')}
            value={
              tx.blockNumber ? (
                <Link className="font-mono text-accent" to={`/blocks/${tx.blockNumber}`}>
                  {tx.blockNumber}
                </Link>
              ) : (
                '—'
              )
            }
          />
          <DetailRow label={t('common:table.time')} value={<Timestamp iso={tx.timestampIso} />} />
          <DetailRow label={t('tx:nonce')} value={tx.nonce ?? '—'} />
          <DetailRow label={t('common:table.from')} value={<AddressLink address={tx.from} label={tx.fromName} shorten={false} />} />
          <DetailRow label={t('common:table.to')} value={<AddressLink address={tx.to} label={tx.toName} shorten={false} />} />
          <DetailRow label={t('common:table.value')} value={<Amount wei={tx.valueWei} />} />
          <DetailRow label={t('tx:gasPrice')} value={formatWeiToGwei(tx.gasPrice)} />
          <DetailRow label={t('tx:gasUsed')} value={tx.gasUsed ?? '—'} />
          <DetailRow label={t('tx:gasLimit')} value={tx.gasLimit ?? '—'} />
          <DetailRow label={t('tx:maxFee')} value={formatWeiToGwei(tx.maxFeePerGas)} />
          <DetailRow label={t('tx:maxPrio')} value={formatWeiToGwei(tx.maxPriorityFeePerGas)} />
          <DetailRow label={t('common:table.fee')} value={tx.fee ?? '—'} />
          <DetailRow
            label={t('tx:input')}
            value={<pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all text-xs">{tx.input ?? '—'}</pre>}
          />
        </dl>
      ) : null}

      {tab === 'token-transfers' ? (
        <TabList
          loading={tokenTransfersQuery.isPending}
          error={tokenTransfersQuery.isError ? tokenTransfersQuery.error : null}
          empty={!tokenTransfersQuery.isPending && tokenTransfersQuery.isSuccess && tokenTransfersQuery.data.items.length === 0}
          onRetry={() => void tokenTransfersQuery.refetch()}
        >
          {tokenTransfersQuery.isSuccess ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">{t('common:table.tx')}</th>
                      <th className="px-3 py-2">{t('common:table.method')}</th>
                      <th className="px-3 py-2">{t('common:table.from')}</th>
                      <th className="px-3 py-2">{t('common:table.to')}</th>
                      <th className="px-3 py-2">{t('token:symbol')}</th>
                      <th className="px-3 py-2">{t('common:table.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenTransfersQuery.data.items.map((row, i) => (
                      <tr key={`${row.transactionHash}-${i}`} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{row.method ?? '—'}</td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.from} label={row.fromName} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.to} label={row.toName} />
                        </td>
                        <td className="px-3 py-2">{row.tokenSymbol ?? '—'}</td>
                        <td className="px-3 py-2 font-mono text-xs">{row.amountRaw ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                hasPrev={ttPg.canGoPrev}
                hasNext={keysetHasNext(tokenTransfersQuery.data.nextPageParams)}
                onPrev={ttPg.goPrev}
                onNext={() => ttPg.goNext(tokenTransfersQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabList>
      ) : null}

      {tab === 'logs' ? (
        <TabList
          loading={logsQuery.isPending}
          error={logsQuery.isError ? logsQuery.error : null}
          empty={!logsQuery.isPending && logsQuery.isSuccess && logsQuery.data.items.length === 0}
          onRetry={() => void logsQuery.refetch()}
        >
          {logsQuery.isSuccess ? (
            <>
              <div className="space-y-2">
                {logsQuery.data.items.map((log, i) => (
                  <div key={i} className="rounded border border-border bg-surface p-3 text-xs font-mono">
                    <div className="text-slate-500">#{log.index ?? i}</div>
                    <div className="mt-1 break-all">
                      <AddressLink address={log.address} shorten={false} />
                    </div>
                    <div className="mt-1 break-all text-slate-600 dark:text-slate-300">{log.data ?? ''}</div>
                  </div>
                ))}
              </div>
              <PaginationControls
                hasPrev={logsPg.canGoPrev}
                hasNext={keysetHasNext(logsQuery.data.nextPageParams)}
                onPrev={logsPg.goPrev}
                onNext={() => logsPg.goNext(logsQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabList>
      ) : null}

      {tab === 'internal' ? (
        <TabList
          loading={internalQuery.isPending}
          error={internalQuery.isError ? internalQuery.error : null}
          empty={!internalQuery.isPending && internalQuery.isSuccess && internalQuery.data.items.length === 0}
          onRetry={() => void internalQuery.refetch()}
        >
          {internalQuery.isSuccess ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">{t('common:table.from')}</th>
                      <th className="px-3 py-2">{t('common:table.to')}</th>
                      <th className="px-3 py-2">{t('common:table.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internalQuery.data.items.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{row.type ?? '—'}</td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.from} label={row.fromName} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.to} label={row.toName} />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{row.value ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                hasPrev={intPg.canGoPrev}
                hasNext={keysetHasNext(internalQuery.data.nextPageParams)}
                onPrev={intPg.goPrev}
                onNext={() => intPg.goNext(internalQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabList>
      ) : null}

      {tab === 'state' ? (
        stateQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : stateQuery.isError ? (
          <ErrorState error={stateQuery.error} onRetry={() => void stateQuery.refetch()} />
        ) : stateQuery.data == null ||
          (typeof stateQuery.data === 'object' &&
            Object.keys(stateQuery.data as object).length === 0) ? (
          <EmptyState title={t('common:state.empty')} />
        ) : (
          <FormattedJson data={stateQuery.data} />
        )
      ) : null}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  )
}

function TabList({
  loading,
  error,
  empty,
  onRetry,
  children,
}: {
  loading: boolean
  error: unknown | null
  empty: boolean
  onRetry: () => void
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  if (loading) return <Loading label={t('state.loading')} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (empty) return <EmptyState title={t('state.empty')} />
  return <>{children}</>
}
