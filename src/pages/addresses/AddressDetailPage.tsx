import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import {
  getAddress,
  getAddressCounters,
  getAddressInternalTxs,
  getAddressLogs,
  getAddressTokenBalances,
  getAddressTokenTransfers,
  getAddressTransactions,
} from '@/api/addresses'
import { ApiError } from '@/api/client'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { AddressLink } from '@/components/common/AddressLink'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { Amount } from '@/components/common/Amount'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PaginationControls } from '@/components/common/PaginationControls'
import { keysetHasNext } from '@/utils/query'
import { useKeysetPagination } from '@/hooks/useKeysetPagination'
import { stableStringifyParams } from '@/utils/query'
import { CopyButton } from '@/components/common/CopyButton'
import { getSmartContract } from '@/api/contracts'
import { ContractSourcePanel } from '@/components/addresses/ContractSourcePanel'

const TABS = ['transactions', 'token-transfers', 'internal-txs', 'logs', 'tokens', 'contract'] as const
type TabId = (typeof TABS)[number]

function isTab(s: string | null): s is TabId {
  return s !== null && (TABS as readonly string[]).includes(s)
}

export function AddressDetailPage() {
  const { address = '' } = useParams<{ address: string }>()
  const { t } = useTranslation(['address', 'common', 'token'])
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')

  const detailQuery = useQuery({
    queryKey: ['addresses', 'detail', address],
    queryFn: () => getAddress(address),
    enabled: Boolean(address),
  })

  const countersQuery = useQuery({
    queryKey: ['addresses', 'counters', address],
    queryFn: () => getAddressCounters(address),
    enabled: Boolean(address) && detailQuery.isSuccess,
  })

  const tab: TabId = useMemo(() => {
    if (!isTab(rawTab)) return 'transactions'
    if (rawTab === 'contract') {
      if (!detailQuery.isSuccess) return 'transactions'
      if (!detailQuery.data.isContract) return 'transactions'
    }
    return rawTab
  }, [rawTab, detailQuery.isSuccess, detailQuery.data])

  useEffect(() => {
    if (!detailQuery.isSuccess) return
    if (!detailQuery.data.isContract && searchParams.get('tab') === 'contract') {
      const p = new URLSearchParams(searchParams)
      p.set('tab', 'transactions')
      setSearchParams(p, { replace: true })
    }
  }, [detailQuery.isSuccess, detailQuery.data, searchParams, setSearchParams])

  const contractQuery = useQuery({
    queryKey: ['smart-contracts', address],
    queryFn: () => getSmartContract(address),
    enabled: Boolean(address) && tab === 'contract' && detailQuery.isSuccess && detailQuery.data.isContract,
  })

  const txPg = useKeysetPagination()
  const txQuery = useQuery({
    queryKey: ['addresses', address, 'txs', stableStringifyParams(txPg.requestCursor)],
    queryFn: () => getAddressTransactions(address, txPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'transactions',
  })

  const ttPg = useKeysetPagination()
  const ttQuery = useQuery({
    queryKey: ['addresses', address, 'tt', stableStringifyParams(ttPg.requestCursor)],
    queryFn: () => getAddressTokenTransfers(address, ttPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'token-transfers',
  })

  const intPg = useKeysetPagination()
  const intQuery = useQuery({
    queryKey: ['addresses', address, 'internal', stableStringifyParams(intPg.requestCursor)],
    queryFn: () => getAddressInternalTxs(address, intPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'internal-txs',
  })

  const logsPg = useKeysetPagination()
  const logsQuery = useQuery({
    queryKey: ['addresses', address, 'logs', stableStringifyParams(logsPg.requestCursor)],
    queryFn: () => getAddressLogs(address, logsPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'logs',
  })

  const tokPg = useKeysetPagination()
  const tokQuery = useQuery({
    queryKey: ['addresses', address, 'tokens', stableStringifyParams(tokPg.requestCursor)],
    queryFn: () => getAddressTokenBalances(address, tokPg.requestCursor ?? undefined),
    enabled: Boolean(address) && tab === 'tokens',
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

  const a = detailQuery.data
  const counters = countersQuery.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('address:detailTitle')}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 break-all font-mono text-sm">
          <span>{a.hash}</span>
          <CopyButton text={a.hash} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {a.isContract ? t('address:contract') : t('address:eoa')}
          {a.name ? ` · ${a.name}` : ''}
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('address:balance')}</dt>
          <dd className="mt-1">
            <Amount wei={a.balanceWei} />
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Tx</dt>
          <dd className="mt-1">{counters?.transactionsCount ?? '—'}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {(
          [
            ['transactions', t('address:tabs.transactions')],
            ['token-transfers', t('address:tabs.tokenTransfers')],
            ['internal-txs', t('address:tabs.internal')],
            ['logs', t('address:tabs.logs')],
            ['tokens', t('address:tabs.tokens')],
            ...(a.isContract ? [['contract', t('address:tabs.contract')] as const] : []),
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

      {tab === 'transactions' ? (
        <TabBody
          loading={txQuery.isPending}
          error={txQuery.isError ? txQuery.error : null}
          empty={!txQuery.isPending && txQuery.isSuccess && txQuery.data.items.length === 0}
          onRetry={() => void txQuery.refetch()}
        >
          {txQuery.isSuccess ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">{t('common:table.tx')}</th>
                      <th className="px-3 py-2">{t('common:table.status')}</th>
                      <th className="px-3 py-2">{t('common:table.time')}</th>
                      <th className="px-3 py-2">{t('common:table.from')}</th>
                      <th className="px-3 py-2">{t('common:table.to')}</th>
                      <th className="px-3 py-2">{t('common:table.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txQuery.data.items.map((tx) => (
                      <tr key={tx.hash} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          <HashText hash={tx.hash} to={`/tx/${tx.hash}`} />
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Timestamp iso={tx.timestampIso} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={tx.from} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={tx.to} />
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
                hasPrev={txPg.canGoPrev}
                hasNext={keysetHasNext(txQuery.data.nextPageParams)}
                onPrev={txPg.goPrev}
                onNext={() => txPg.goNext(txQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabBody>
      ) : null}

      {tab === 'token-transfers' ? (
        <TabBody
          loading={ttQuery.isPending}
          error={ttQuery.isError ? ttQuery.error : null}
          empty={!ttQuery.isPending && ttQuery.isSuccess && ttQuery.data.items.length === 0}
          onRetry={() => void ttQuery.refetch()}
        >
          {ttQuery.isSuccess ? (
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
                    {ttQuery.data.items.map((row, i) => (
                      <tr key={`${row.transactionHash}-${i}`} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          <HashText hash={row.transactionHash} to={row.transactionHash ? `/tx/${row.transactionHash}` : undefined} />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{row.method ?? '—'}</td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.from} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.to} />
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
                hasNext={keysetHasNext(ttQuery.data.nextPageParams)}
                onPrev={ttPg.goPrev}
                onNext={() => ttPg.goNext(ttQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabBody>
      ) : null}

      {tab === 'internal-txs' ? (
        <TabBody
          loading={intQuery.isPending}
          error={intQuery.isError ? intQuery.error : null}
          empty={!intQuery.isPending && intQuery.isSuccess && intQuery.data.items.length === 0}
          onRetry={() => void intQuery.refetch()}
        >
          {intQuery.isSuccess ? (
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
                    {intQuery.data.items.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{row.type ?? '—'}</td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.from} />
                        </td>
                        <td className="px-3 py-2">
                          <AddressLink address={row.to} />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{row.value ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                hasPrev={intPg.canGoPrev}
                hasNext={keysetHasNext(intQuery.data.nextPageParams)}
                onPrev={intPg.goPrev}
                onNext={() => intPg.goNext(intQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabBody>
      ) : null}

      {tab === 'logs' ? (
        <TabBody
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
                    <div className="break-all">{log.address ?? '—'}</div>
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
        </TabBody>
      ) : null}

      {tab === 'tokens' ? (
        <TabBody
          loading={tokQuery.isPending}
          error={tokQuery.isError ? tokQuery.error : null}
          empty={!tokQuery.isPending && tokQuery.isSuccess && tokQuery.data.items.length === 0}
          onRetry={() => void tokQuery.refetch()}
        >
          {tokQuery.isSuccess ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">{t('token:symbol')}</th>
                      <th className="px-3 py-2">{t('common:table.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokQuery.data.items.map((row, i) => (
                      <tr key={`${row.token}-${i}`} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          {row.token ? (
                            <Link className="font-mono text-accent" to={`/token/${row.token}`}>
                              {row.token}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{row.value ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                hasPrev={tokPg.canGoPrev}
                hasNext={keysetHasNext(tokQuery.data.nextPageParams)}
                onPrev={tokPg.goPrev}
                onNext={() => tokPg.goNext(tokQuery.data.nextPageParams)}
              />
            </>
          ) : null}
        </TabBody>
      ) : null}

      {tab === 'contract' && a.isContract ? (
        contractQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : contractQuery.isError ? (
          <ErrorState error={contractQuery.error} onRetry={() => void contractQuery.refetch()} />
        ) : contractQuery.data == null ? (
          <EmptyState title={t('address:contractUnavailable')} />
        ) : (
          <ContractSourcePanel vm={contractQuery.data} />
        )
      ) : null}
    </div>
  )
}

function TabBody({
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
  children: React.ReactNode
}) {
  const { t } = useTranslation('common')
  if (loading) return <Loading label={t('state.loading')} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (empty) return <EmptyState title={t('state.empty')} />
  return <>{children}</>
}
