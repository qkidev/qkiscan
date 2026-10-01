import { apiClient, unwrap } from './client'
import type {
  BlockscoutMarketChartRaw,
  BlockscoutStatsRaw,
  BlockscoutTransactionsChartRaw,
  BlockscoutTransactionsStatsRaw,
} from './types'
import type {
  ExplorerMarketChartPointVM,
  ExplorerStatsVM,
  ExplorerTransactionsChartPointVM,
  ExplorerTransactionsStatsVM,
} from './view-models'

function asStringOrNull(v: string | number | null | undefined): string | null {
  return v == null ? null : String(v)
}

function asNumberOrNull(v: string | number | null | undefined): number | null {
  if (v == null) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function mapStats(raw: BlockscoutStatsRaw): ExplorerStatsVM {
  return {
    totalBlocks: asStringOrNull(raw.total_blocks),
    totalTransactions: asStringOrNull(raw.total_transactions),
    totalAddresses: asStringOrNull(raw.total_addresses),
    averageBlockTimeSeconds: asNumberOrNull(raw.average_block_time),
    transactionsToday: asStringOrNull(raw.transactions_today),
    marketCapUsd: asStringOrNull(raw.market_cap),
    coinPriceUsd: asStringOrNull(raw.coin_price),
    coinPriceChangePercentage: asNumberOrNull(raw.coin_price_change_percentage),
    networkUtilizationPercentage: asNumberOrNull(raw.network_utilization_percentage),
    gasPriceSlowGwei: asNumberOrNull(raw.gas_prices?.slow),
    gasPriceAverageGwei: asNumberOrNull(raw.gas_prices?.average),
    gasPriceFastGwei: asNumberOrNull(raw.gas_prices?.fast),
  }
}

/** 链统计（首页卡片） */
export async function getStatsCounters(): Promise<ExplorerStatsVM> {
  const data = await unwrap(apiClient.get<BlockscoutStatsRaw>('/v2/stats'))
  return mapStats(data)
}

/** 链总览统计 */
export async function getStatsOverview(): Promise<ExplorerStatsVM> {
  return getStatsCounters()
}

function mapTransactionsStats(raw: BlockscoutTransactionsStatsRaw): ExplorerTransactionsStatsVM {
  return {
    pendingTransactionsCount: asStringOrNull(raw.pending_transactions_count),
    transactionsCount24h: asStringOrNull(raw.transactions_count_24h),
    transactionFeesAvg24hWei: asStringOrNull(raw.transaction_fees_avg_24h),
    transactionFeesSum24hWei: asStringOrNull(raw.transaction_fees_sum_24h),
  }
}

/** 交易统计（24h） */
export async function getTransactionsStats(): Promise<ExplorerTransactionsStatsVM> {
  const data = await unwrap(apiClient.get<BlockscoutTransactionsStatsRaw>('/v2/transactions/stats'))
  return mapTransactionsStats(data)
}

function mapTransactionsChart(raw: BlockscoutTransactionsChartRaw): ExplorerTransactionsChartPointVM[] {
  const rows = Array.isArray(raw.chart_data) ? raw.chart_data : []
  return rows
    .map((row) => ({
      date: typeof row.date === 'string' ? row.date : '',
      transactionsCount: asNumberOrNull(row.transactions_count),
    }))
    .filter((row) => row.date.length > 0)
}

/** 每日交易数量走势 */
export async function getTransactionsChart(): Promise<ExplorerTransactionsChartPointVM[]> {
  const data = await unwrap(apiClient.get<BlockscoutTransactionsChartRaw>('/v2/stats/charts/transactions'))
  return mapTransactionsChart(data)
}

function mapMarketChart(raw: BlockscoutMarketChartRaw): ExplorerMarketChartPointVM[] {
  const rows = Array.isArray(raw.chart_data) ? raw.chart_data : []
  return rows
    .map((row) => ({
      date: typeof row.date === 'string' ? row.date : '',
      closingPriceUsd: asNumberOrNull(row.closing_price),
      marketCapUsd: asNumberOrNull(row.market_cap),
      tvlUsd: asNumberOrNull(row.tvl),
    }))
    .filter((row) => row.date.length > 0)
}

/** 市场数据走势（价格/市值） */
export async function getMarketChart(): Promise<ExplorerMarketChartPointVM[]> {
  const data = await unwrap(apiClient.get<BlockscoutMarketChartRaw>('/v2/stats/charts/market'))
  return mapMarketChart(data)
}
