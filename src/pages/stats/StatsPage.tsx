import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getMarketChart,
  getStatsOverview,
  getTransactionsChart,
  getTransactionsStats,
} from '@/api/stats'
import type { ExplorerMarketChartPointVM, ExplorerTransactionsChartPointVM } from '@/api/view-models'
import { Amount } from '@/components/common/Amount'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Loading } from '@/components/common/Loading'

interface OptionalQueryResult<T> {
  data: T | null
  unavailable: boolean
}

export function StatsPage() {
  const { t, i18n } = useTranslation(['stats', 'common'])
  const locale = i18n.language

  const query = useQuery({
    queryKey: ['stats', 'overview-page'],
    queryFn: async () => {
      const [overview, txStats, txChart, marketChart] = await Promise.all([
        getStatsOverview(),
        getOptionalData(() => getTransactionsStats()),
        getOptionalData(() => getTransactionsChart()),
        getOptionalData(() => getMarketChart()),
      ])
      return { overview, txStats, txChart, marketChart }
    },
    staleTime: 30_000,
  })

  if (query.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }

  const { overview, txStats, txChart, marketChart } = query.data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('stats:title')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{t('stats:subtitle')}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t('stats:overview.totalBlocks')} value={formatCount(overview.totalBlocks, locale)} />
        <MetricCard
          label={t('stats:overview.totalTransactions')}
          value={formatCount(overview.totalTransactions, locale)}
        />
        <MetricCard
          label={t('stats:overview.totalAddresses')}
          value={formatCount(overview.totalAddresses, locale)}
        />
        <MetricCard
          label={t('stats:overview.averageBlockTime')}
          value={formatSeconds(overview.averageBlockTimeSeconds, locale)}
        />
        <MetricCard
          label={t('stats:overview.transactionsToday')}
          value={formatCount(overview.transactionsToday, locale)}
        />
        <MetricCard
          label={t('stats:overview.gasPriceAverage')}
          value={formatGwei(overview.gasPriceAverageGwei, locale)}
        />
        <MetricCard
          label={t('stats:overview.coinPrice')}
          value={formatUsd(overview.coinPriceUsd, locale)}
          hint={formatPercent(overview.coinPriceChangePercentage, locale)}
        />
        <MetricCard
          label={t('stats:overview.networkUtilization')}
          value={formatPercent(overview.networkUtilizationPercentage, locale)}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-medium">{t('stats:charts.transactionsTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('stats:charts.transactionsHint')}</p>
          <div className="mt-4">
            <TransactionsBarChart
              points={txChart.data}
              unavailable={txChart.unavailable}
              locale={locale}
              emptyLabel={t('common:state.empty')}
              unavailableLabel={t('stats:charts.unavailable')}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-medium">{t('stats:charts.marketTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('stats:charts.marketHint')}</p>
          <div className="mt-4">
            <MarketLineChart
              points={marketChart.data}
              unavailable={marketChart.unavailable}
              locale={locale}
              emptyLabel={t('common:state.empty')}
              unavailableLabel={t('stats:charts.unavailable')}
              minLabel={t('stats:charts.minPrice')}
              maxLabel={t('stats:charts.maxPrice')}
              rangeChangeLabel={t('stats:charts.rangeChange')}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-medium">{t('stats:tables.tx24hTitle')}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <MetricRow
              label={t('stats:tables.transactions24h')}
              value={formatCount(txStats.data?.transactionsCount24h ?? null, locale)}
            />
            <MetricRow
              label={t('stats:tables.pendingTransactions')}
              value={formatCount(txStats.data?.pendingTransactionsCount ?? null, locale)}
            />
            <MetricRow
              label={t('stats:tables.avgFee24h')}
              value={<Amount wei={txStats.data?.transactionFeesAvg24hWei ?? null} />}
            />
            <MetricRow
              label={t('stats:tables.totalFees24h')}
              value={<Amount wei={txStats.data?.transactionFeesSum24hWei ?? null} />}
            />
          </dl>
          {txStats.unavailable ? <p className="mt-3 text-xs text-slate-500">{t('stats:charts.unavailable')}</p> : null}
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-medium">{t('stats:tables.gasTitle')}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <MetricRow label={t('stats:tables.gasSlow')} value={formatGwei(overview.gasPriceSlowGwei, locale)} />
            <MetricRow label={t('stats:tables.gasAverage')} value={formatGwei(overview.gasPriceAverageGwei, locale)} />
            <MetricRow label={t('stats:tables.gasFast')} value={formatGwei(overview.gasPriceFastGwei, locale)} />
            <MetricRow label={t('stats:tables.marketCap')} value={formatUsd(overview.marketCapUsd, locale)} />
          </dl>
        </section>
      </div>
    </div>
  )
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string | null }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium tabular-nums text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}

function TransactionsBarChart({
  points,
  unavailable,
  locale,
  emptyLabel,
  unavailableLabel,
}: {
  points: ExplorerTransactionsChartPointVM[] | null
  unavailable: boolean
  locale: string
  emptyLabel: string
  unavailableLabel: string
}) {
  if (unavailable) return <EmptyState title={unavailableLabel} />
  if (!points || points.length === 0) return <EmptyState title={emptyLabel} />

  const valid = points.filter((point) => point.transactionsCount != null)
  if (valid.length === 0) return <EmptyState title={emptyLabel} />
  const maxValue = Math.max(...valid.map((point) => point.transactionsCount as number))
  if (!Number.isFinite(maxValue) || maxValue <= 0) return <EmptyState title={emptyLabel} />

  return (
    <div className="space-y-2">
      <div className="flex h-44 items-end gap-1 rounded-md border border-border bg-surface-muted/50 p-2">
        {valid.map((point) => {
          const value = point.transactionsCount as number
          const height = Math.max((value / maxValue) * 100, 2)
          const title = `${point.date} · ${new Intl.NumberFormat(locale).format(value)}`
          return (
            <div key={point.date} className="group flex h-full flex-1 items-end">
              <div
                className="w-full rounded-sm bg-accent/80 transition group-hover:bg-accent"
                style={{ height: `${height}%` }}
                title={title}
                aria-label={title}
              />
            </div>
          )
        })}
      </div>
      <div className="text-xs text-slate-500">
        {valid[0]?.date} → {valid[valid.length - 1]?.date}
      </div>
    </div>
  )
}

function MarketLineChart({
  points,
  unavailable,
  locale,
  emptyLabel,
  unavailableLabel,
  minLabel,
  maxLabel,
  rangeChangeLabel,
}: {
  points: ExplorerMarketChartPointVM[] | null
  unavailable: boolean
  locale: string
  emptyLabel: string
  unavailableLabel: string
  minLabel: string
  maxLabel: string
  rangeChangeLabel: string
}) {
  if (unavailable) return <EmptyState title={unavailableLabel} />
  if (!points || points.length === 0) return <EmptyState title={emptyLabel} />

  const valid = points.filter((point) => point.closingPriceUsd != null)
  if (valid.length < 2) return <EmptyState title={emptyLabel} />

  const values = valid.map((point) => point.closingPriceUsd as number)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const span = Math.max(maxValue - minValue, 1)
  const width = 720
  const height = 220
  const pad = 16
  const path = valid
    .map((point, idx) => {
      const x = pad + (idx / (valid.length - 1)) * (width - pad * 2)
      const y = pad + ((maxValue - (point.closingPriceUsd as number)) / span) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  const latest = valid[valid.length - 1]!.closingPriceUsd
  const first = valid[0]!.closingPriceUsd
  const rangeChange =
    latest != null && first != null && Number.isFinite(first) && first !== 0
      ? ((latest - first) / first) * 100
      : null

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-border bg-surface-muted/50 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label={unavailableLabel}>
          <polyline fill="none" stroke="currentColor" strokeWidth="3" className="text-accent" points={path} />
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span>
          {minLabel}: {new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(minValue)}
        </span>
        <span>
          {maxLabel}: {new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(maxValue)}
        </span>
        <span>
          {rangeChangeLabel}: {formatPercent(rangeChange, locale)}
        </span>
      </div>
    </div>
  )
}

async function getOptionalData<T>(fn: () => Promise<T>): Promise<OptionalQueryResult<T>> {
  try {
    const data = await fn()
    return { data, unavailable: false }
  } catch {
    return { data: null, unavailable: true }
  }
}

function formatCount(value: string | null, locale: string): string {
  if (!value) return '—'
  if (/^-?\d+$/.test(value)) {
    try {
      return new Intl.NumberFormat(locale).format(BigInt(value))
    } catch {
      return value
    }
  }
  const n = Number(value)
  return Number.isFinite(n) ? new Intl.NumberFormat(locale).format(n) : value
}

function formatSeconds(value: number | null, locale: string): string {
  if (value == null) return '—'
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} s`
}

function formatGwei(value: number | null, locale: string): string {
  if (value == null) return '—'
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value)} gwei`
}

function formatUsd(value: string | null, locale: string): string {
  if (!value) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 4 }).format(n)
}

function formatPercent(value: number | null, locale: string): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}%`
}
