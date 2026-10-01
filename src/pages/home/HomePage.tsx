import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStatsCounters } from '@/api/stats'
import { getMainPageBlocks } from '@/api/blocks'
import { getMainPageTransactions } from '@/api/transactions'
import type { ExplorerStatsVM } from '@/api/view-models'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'

const integerFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const compactUsdFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

function formatNumberString(raw: string | null): string {
  if (!raw) return '—'
  const n = Number(raw)
  return Number.isFinite(n) ? integerFormatter.format(n) : raw
}

function formatNullableNumber(raw: number | null, options?: { unit?: string; percent?: boolean }): string {
  if (raw == null || Number.isNaN(raw)) return '—'
  const value = decimalFormatter.format(raw)
  if (options?.percent) return `${value}%`
  if (options?.unit) return `${value} ${options.unit}`
  return value
}

export function HomePage() {
  const { t } = useTranslation(['home', 'common'])

  const statsQuery = useQuery({
    queryKey: ['home', 'stats'],
    queryFn: getStatsCounters,
    staleTime: 25_000,
  })

  const latestQuery = useQuery({
    queryKey: ['home', 'latest'],
    queryFn: async () => {
      const blocks = await getMainPageBlocks()
      const txs = await getMainPageTransactions()
      return { blocks, txs }
    },
    staleTime: 25_000,
  })

  if (latestQuery.isPending && statsQuery.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (latestQuery.isError && !latestQuery.data) {
    return <ErrorState error={latestQuery.error} onRetry={() => void latestQuery.refetch()} />
  }

  const blocks = latestQuery.data?.blocks ?? []
  const txs = latestQuery.data?.txs ?? []
  const empty = blocks.length === 0 && txs.length === 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('home:title')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{t('home:subtitle')}</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">{t('home:stats.sectionTitle')}</h2>
          <Link className="text-sm text-accent" to="/stats">
            {t('home:stats.viewCharts')}
          </Link>
        </div>
        {statsQuery.isPending ? <StatsSkeleton /> : null}
        {statsQuery.isError ? <ErrorState error={statsQuery.error} onRetry={() => void statsQuery.refetch()} /> : null}
        {statsQuery.data ? <StatsGrid stats={statsQuery.data} /> : null}
      </section>

      {latestQuery.isPending ? (
        <Loading label={t('common:state.loading')} />
      ) : latestQuery.isError ? (
        <ErrorState error={latestQuery.error} onRetry={() => void latestQuery.refetch()} />
      ) : empty ? (
        <EmptyState title={t('common:state.empty')} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium">{t('home:latestBlocks')}</h2>
              <Link className="text-sm text-accent" to="/blocks">
                {t('home:viewAll')}
              </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{t('common:table.block')}</th>
                    <th className="px-3 py-2">{t('common:table.hash')}</th>
                    <th className="px-3 py-2">{t('common:table.time')}</th>
                    <th className="hidden px-3 py-2 sm:table-cell">{t('common:table.miner')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b) => (
                    <tr key={`${b.height}-${b.hash}`} className="border-b border-border last:border-0">
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
                      <td className="hidden px-3 py-2 sm:table-cell">
                        <AddressLink address={b.minerAddress} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium">{t('home:latestTxs')}</h2>
              <Link className="text-sm text-accent" to="/txs">
                {t('home:viewAll')}
              </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{t('common:table.tx')}</th>
                    <th className="px-3 py-2">{t('common:table.time')}</th>
                    <th className="hidden px-3 py-2 md:table-cell">{t('common:table.from')}</th>
                    <th className="hidden px-3 py-2 lg:table-cell">{t('common:table.to')}</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => (
                    <tr key={tx.hash} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <HashText hash={tx.hash} to={`/tx/${tx.hash}`} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Timestamp iso={tx.timestampIso} />
                      </td>
                      <td className="hidden px-3 py-2 md:table-cell">
                        <AddressLink address={tx.from} label={tx.fromName} />
                      </td>
                      <td className="hidden px-3 py-2 lg:table-cell">
                        <AddressLink address={tx.to} label={tx.toName} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function StatsGrid({ stats }: { stats: ExplorerStatsVM }) {
  const { t } = useTranslation('home')
  const cards: {
    label: string
    value: string
    to?: string
    ariaLabel?: string
  }[] = [
    {
      label: t('stats.totalBlocks'),
      value: formatNumberString(stats.totalBlocks),
      to: '/blocks',
      ariaLabel: t('stats.goBlocks'),
    },
    {
      label: t('stats.totalTxs'),
      value: formatNumberString(stats.totalTransactions),
      to: '/txs',
      ariaLabel: t('stats.goTxs'),
    },
    {
      label: t('stats.totalAddresses'),
      value: formatNumberString(stats.totalAddresses),
      to: '/search',
      ariaLabel: t('stats.goAddresses'),
    },
    {
      label: t('stats.txsToday'),
      value: formatNumberString(stats.transactionsToday),
      to: '/txs',
      ariaLabel: t('stats.goTxs'),
    },
    {
      label: t('stats.avgBlockTime'),
      value: formatNullableNumber(stats.averageBlockTimeSec, { unit: t('stats.unitSeconds') }),
      to: '/stats',
      ariaLabel: t('stats.goCharts'),
    },
    {
      label: t('stats.avgGasPrice'),
      value: formatNullableNumber(stats.gasPrices?.average ?? null, { unit: t('stats.unitGwei') }),
      to: '/stats',
      ariaLabel: t('stats.goCharts'),
    },
    {
      label: t('stats.marketCap'),
      value: stats.marketCapUsd != null ? compactUsdFormatter.format(stats.marketCapUsd) : '—',
      to: '/stats',
      ariaLabel: t('stats.goCharts'),
    },
    {
      label: t('stats.networkUtilization'),
      value: formatNullableNumber(stats.networkUtilizationPercent, { percent: true }),
      to: '/stats',
      ariaLabel: t('stats.goCharts'),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} to={card.to} ariaLabel={card.ariaLabel} />
      ))}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="h-3 w-28 rounded bg-surface-muted" />
          <div className="mt-3 h-6 w-24 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  to,
  ariaLabel,
}: {
  label: string
  value: string
  to?: string
  ariaLabel?: string
}) {
  const content = (
    <>
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
    </>
  )
  const baseClassName =
    'block rounded-lg border border-border bg-surface p-4 shadow-sm no-underline transition hover:border-accent hover:shadow-md hover:no-underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

  if (to) {
    return (
      <Link to={to} aria-label={ariaLabel} className={baseClassName}>
        {content}
      </Link>
    )
  }
  return <div className={baseClassName}>{content}</div>
}
