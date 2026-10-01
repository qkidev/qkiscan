import { apiClient, unwrap } from './client'
import type {
  BlockscoutMarketChartRaw,
  BlockscoutStatsRaw,
  BlockscoutTransactionsChartRaw,
} from './types'
import type { ExplorerMarketChartVM, ExplorerStatsVM, ExplorerTransactionsChartVM } from './view-models'

function asString(value: string | number | null | undefined): string | null {
  if (value == null) return null
  const s = String(value).trim()
  return s === '' ? null : s
}

function asNumber(value: string | number | null | undefined): number | null {
  if (value == null) return null
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

function mapStats(raw: BlockscoutStatsRaw): ExplorerStatsVM {
  return {
    totalBlocks: asString(raw.total_blocks),
    totalTransactions: asString(raw.total_transactions),
    totalAddresses: asString(raw.total_addresses),
    totalGasUsed: asString(raw.total_gas_used),
    transactionsToday: asString(raw.transactions_today),
    averageBlockTimeSec: asNumber(raw.average_block_time),
    networkUtilizationPercent: asNumber(raw.network_utilization_percentage),
    coinPriceUsd: asNumber(raw.coin_price),
    coinPriceChangePercent: asNumber(raw.coin_price_change_percentage),
    marketCapUsd: asNumber(raw.market_cap),
    gasPrices: raw.gas_prices
      ? {
          slow: asNumber(raw.gas_prices.slow),
          average: asNumber(raw.gas_prices.average),
          fast: asNumber(raw.gas_prices.fast),
        }
      : null,
  }
}

function mapTransactionsChart(raw: BlockscoutTransactionsChartRaw): ExplorerTransactionsChartVM {
  const points = (raw.chart_data ?? [])
    .map((item) => {
      const date = asString(item.date)
      const txCount = asNumber(item.transactions_count)
      return date && txCount != null
        ? {
            date,
            transactionsCount: txCount,
          }
        : null
    })
    .filter((item): item is NonNullable<typeof item> => item != null)
    .sort((a, b) => a.date.localeCompare(b.date))

  return { points }
}

function mapMarketChart(raw: BlockscoutMarketChartRaw): ExplorerMarketChartVM {
  const points = (raw.chart_data ?? [])
    .map((item) => {
      const date = asString(item.date)
      return date
        ? {
            date,
            closingPrice: asNumber(item.closing_price),
            marketCap: asNumber(item.market_cap),
            tvl: asNumber(item.tvl),
          }
        : null
    })
    .filter((item): item is NonNullable<typeof item> => item != null)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    availableSupply: asString(raw.available_supply),
    points,
  }
}

/** 链统计（首页卡片） */
export async function getStatsCounters(): Promise<ExplorerStatsVM> {
  const data = await unwrap(apiClient.get<BlockscoutStatsRaw>('/v2/stats'))
  return mapStats(data)
}

/** 日交易量图表数据 */
export async function getTransactionsChart(): Promise<ExplorerTransactionsChartVM> {
  const data = await unwrap(apiClient.get<BlockscoutTransactionsChartRaw>('/v2/stats/charts/transactions'))
  return mapTransactionsChart(data)
}

/** 原生币价格/市值图表数据 */
export async function getMarketChart(): Promise<ExplorerMarketChartVM> {
  const data = await unwrap(apiClient.get<BlockscoutMarketChartRaw>('/v2/stats/charts/market'))
  return mapMarketChart(data)
}
