import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { getMarketChart, getStatsCounters, getTransactionsChart } from '@/api/stats'
import type { ExplorerMarketChartPointVM, ExplorerStatsVM, ExplorerTransactionsChartPointVM } from '@/api/view-models'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'

type LinePoint = {
  label: string
  value: number
}

const integerFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const usdFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})
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

function formatNumber(raw: number | null): string {
  if (raw == null || Number.isNaN(raw)) return '—'
  return decimalFormatter.format(raw)
}

function formatPercent(raw: number | null): string {
  if (raw == null || Number.isNaN(raw)) return '—'
  return `${decimalFormatter.format(raw)}%`
}

function formatUsd(raw: number | null, compact = false): string {
  if (raw == null || Number.isNaN(raw)) return '—'
  return compact ? compactUsdFormatter.format(raw) : usdFormatter.format(raw)
}

function toLinePoints(
  points: ExplorerMarketChartPointVM[] | ExplorerTransactionsChartPointVM[],
  selector: (point: ExplorerMarketChartPointVM | ExplorerTransactionsChartPointVM) => number | null,
): LinePoint[] {
  return points
    .map((point) => {
      const value = selector(point)
      return value != null
        ? {
            label: point.date,
            value,
          }
        : null
    })
    .filter((point): point is LinePoint => point != null)
}

export function StatsPage() {
  const { t } = useTranslation(['stats', 'common'])
  const statsQuery = useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: getStatsCounters,
    staleTime: 30_000,
  })
  const txChartQuery = useQuery({
    queryKey: ['stats', 'chart', 'transactions'],
    queryFn: getTransactionsChart,
    staleTime: 60_000,
  })
  const marketChartQuery = useQuery({
    queryKey: ['stats', 'chart', 'market'],
    queryFn: getMarketChart,
    staleTime: 60_000,
  })

  if (statsQuery.isPending && txChartQuery.isPending && marketChartQuery.isPending) {
    return <Loading label={t('common:state.loading')} />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('stats:title')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{t('stats:subtitle')}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t('stats:summaryTitle')}</h2>
        {statsQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : statsQuery.isError ? (
          <ErrorState error={statsQuery.error} onRetry={() => void statsQuery.refetch()} />
        ) : (
          <SummaryGrid stats={statsQuery.data} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPanel
          title={t('stats:charts.transactions.title')}
          description={t('stats:charts.transactions.description')}
          queryState={{
            isPending: txChartQuery.isPending,
            isError: txChartQuery.isError,
            error: txChartQuery.error,
            onRetry: () => void txChartQuery.refetch(),
          }}
        >
          <TransactionsChart points={txChartQuery.data?.points ?? []} />
        </ChartPanel>
        <ChartPanel
          title={t('stats:charts.price.title')}
          description={t('stats:charts.price.description')}
          queryState={{
            isPending: marketChartQuery.isPending,
            isError: marketChartQuery.isError,
            error: marketChartQuery.error,
            onRetry: () => void marketChartQuery.refetch(),
          }}
        >
          <MarketPriceChart points={marketChartQuery.data?.points ?? []} />
        </ChartPanel>
        <ChartPanel
          title={t('stats:charts.marketCap.title')}
          description={t('stats:charts.marketCap.description')}
          queryState={{
            isPending: marketChartQuery.isPending,
            isError: marketChartQuery.isError,
            error: marketChartQuery.error,
            onRetry: () => void marketChartQuery.refetch(),
          }}
        >
          <MarketCapChart points={marketChartQuery.data?.points ?? []} />
        </ChartPanel>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t('stats:detailsTitle')}</h2>
        {statsQuery.isPending ? (
          <Loading label={t('common:state.loading')} />
        ) : statsQuery.isError ? (
          <ErrorState error={statsQuery.error} onRetry={() => void statsQuery.refetch()} />
        ) : (
          <DetailsTable stats={statsQuery.data} availableSupply={marketChartQuery.data?.availableSupply ?? null} />
        )}
      </section>
    </div>
  )
}

function SummaryGrid({ stats }: { stats: ExplorerStatsVM }) {
  const { t } = useTranslation('stats')
  const items = [
    { label: t('cards.totalBlocks'), value: formatNumberString(stats.totalBlocks) },
    { label: t('cards.totalTxs'), value: formatNumberString(stats.totalTransactions) },
    { label: t('cards.totalAddresses'), value: formatNumberString(stats.totalAddresses) },
    { label: t('cards.txsToday'), value: formatNumberString(stats.transactionsToday) },
    { label: t('cards.avgBlockTime'), value: `${formatNumber(stats.averageBlockTimeSec)} ${t('units.seconds')}` },
    { label: t('cards.avgGasPrice'), value: `${formatNumber(stats.gasPrices?.average ?? null)} ${t('units.gwei')}` },
    { label: t('cards.marketCap'), value: formatUsd(stats.marketCapUsd, true) },
    { label: t('cards.coinPrice'), value: formatUsd(stats.coinPriceUsd) },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="text-xs uppercase text-slate-500">{item.label}</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

function DetailsTable({ stats, availableSupply }: { stats: ExplorerStatsVM; availableSupply: string | null }) {
  const { t } = useTranslation('stats')
  const rows = [
    { label: t('table.totalBlocks'), value: formatNumberString(stats.totalBlocks) },
    { label: t('table.totalTransactions'), value: formatNumberString(stats.totalTransactions) },
    { label: t('table.totalAddresses'), value: formatNumberString(stats.totalAddresses) },
    { label: t('table.totalGasUsed'), value: formatNumberString(stats.totalGasUsed) },
    { label: t('table.transactionsToday'), value: formatNumberString(stats.transactionsToday) },
    { label: t('table.avgBlockTime'), value: `${formatNumber(stats.averageBlockTimeSec)} ${t('units.seconds')}` },
    { label: t('table.networkUtilization'), value: formatPercent(stats.networkUtilizationPercent) },
    { label: t('table.coinPrice'), value: formatUsd(stats.coinPriceUsd) },
    { label: t('table.coinPriceChange'), value: formatPercent(stats.coinPriceChangePercent) },
    { label: t('table.marketCap'), value: formatUsd(stats.marketCapUsd, true) },
    { label: t('table.gasSlow'), value: `${formatNumber(stats.gasPrices?.slow ?? null)} ${t('units.gwei')}` },
    { label: t('table.gasAverage'), value: `${formatNumber(stats.gasPrices?.average ?? null)} ${t('units.gwei')}` },
    { label: t('table.gasFast'), value: `${formatNumber(stats.gasPrices?.fast ?? null)} ${t('units.gwei')}` },
    { label: t('table.availableSupply'), value: formatNumberString(availableSupply) },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="min-w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th className="w-64 bg-surface-muted px-4 py-2 font-medium text-slate-600 dark:text-slate-200">
                {row.label}
              </th>
              <td className="px-4 py-2 font-mono tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TransactionsChart({ points }: { points: ExplorerTransactionsChartPointVM[] }) {
  const { t } = useTranslation('stats')
  const line = toLinePoints(points, (point) => ('transactionsCount' in point ? point.transactionsCount : null))
  if (line.length === 0) {
    return <EmptyState title={t('state.noChartData')} />
  }
  const latest = line[line.length - 1]
  return (
    <ChartCard latestLabel={t('charts.latest')} latestValue={integerFormatter.format(latest.value)}>
      <Sparkline points={line} />
      <ChartRange points={line} />
    </ChartCard>
  )
}

function MarketPriceChart({ points }: { points: ExplorerMarketChartPointVM[] }) {
  const { t } = useTranslation('stats')
  const line = toLinePoints(points, (point) => ('closingPrice' in point ? point.closingPrice : null))
  if (line.length === 0) {
    return <EmptyState title={t('state.noChartData')} />
  }
  const latest = line[line.length - 1]
  return (
    <ChartCard latestLabel={t('charts.latest')} latestValue={formatUsd(latest.value)}>
      <Sparkline points={line} color="stroke-emerald-500" fill="fill-emerald-500/10" />
      <ChartRange points={line} formatter={(value) => formatUsd(value)} />
    </ChartCard>
  )
}

function MarketCapChart({ points }: { points: ExplorerMarketChartPointVM[] }) {
  const { t } = useTranslation('stats')
  const line = toLinePoints(points, (point) => ('marketCap' in point ? point.marketCap : null))
  if (line.length === 0) {
    return <EmptyState title={t('state.noChartData')} />
  }
  const latest = line[line.length - 1]
  return (
    <ChartCard latestLabel={t('charts.latest')} latestValue={formatUsd(latest.value, true)}>
      <Sparkline points={line} color="stroke-violet-500" fill="fill-violet-500/10" />
      <ChartRange points={line} formatter={(value) => formatUsd(value, true)} />
    </ChartCard>
  )
}

function ChartPanel({
  title,
  description,
  queryState,
  children,
}: {
  title: string
  description: string
  queryState: {
    isPending: boolean
    isError: boolean
    error: unknown
    onRetry: () => void
  }
  children: ReactNode
}) {
  return (
    <section className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {queryState.isPending ? (
        <Loading />
      ) : queryState.isError ? (
        <ErrorState error={queryState.error} onRetry={queryState.onRetry} />
      ) : (
        children
      )}
    </section>
  )
}

function ChartCard({
  latestLabel,
  latestValue,
  children,
}: {
  latestLabel: string
  latestValue: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-surface-muted p-3">
        <div className="text-xs uppercase tracking-wide text-slate-500">{latestLabel}</div>
        <div className="mt-1 text-lg font-semibold tabular-nums">{latestValue}</div>
      </div>
      {children}
    </div>
  )
}

function ChartRange({ points, formatter }: { points: LinePoint[]; formatter?: (value: number) => string }) {
  const format = formatter ?? ((value: number) => integerFormatter.format(value))
  const first = points[0]
  const last = points[points.length - 1]
  return (
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>
        {first.label} · {format(first.value)}
      </span>
      <span>
        {last.label} · {format(last.value)}
      </span>
    </div>
  )
}

function Sparkline({
  points,
  color = 'stroke-blue-500',
  fill = 'fill-blue-500/10',
}: {
  points: LinePoint[]
  color?: string
  fill?: string
}) {
  if (points.length === 0) return null
  const minValue = Math.min(...points.map((point) => point.value))
  const maxValue = Math.max(...points.map((point) => point.value))
  const span = maxValue - minValue || 1
  const width = 100
  const height = 44
  const coordinates = points.map((point, idx) => {
    const x = points.length === 1 ? 0 : (idx / (points.length - 1)) * width
    const y = height - ((point.value - minValue) / span) * (height - 6) - 3
    return { x, y }
  })
  const linePath = coordinates.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
      <path d={areaPath} className={fill} />
      <path d={linePath} className={`${color} fill-none`} strokeWidth={2} />
      <circle
        cx={coordinates[coordinates.length - 1]?.x}
        cy={coordinates[coordinates.length - 1]?.y}
        r={2.4}
        className={color.replace('stroke-', 'fill-')}
      />
    </svg>
  )
}
