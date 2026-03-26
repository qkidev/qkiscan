import { apiClient, unwrap } from './client'
import type { BlockscoutStatsRaw } from './types'
import type { ExplorerStatsVM } from './view-models'

function mapStats(raw: BlockscoutStatsRaw): ExplorerStatsVM {
  return {
    totalBlocks: raw.total_blocks != null ? String(raw.total_blocks) : null,
    totalTransactions: raw.total_transactions != null ? String(raw.total_transactions) : null,
    totalAddresses: raw.total_addresses != null ? String(raw.total_addresses) : null,
  }
}

/** 链统计（首页卡片） */
export async function getStatsCounters(): Promise<ExplorerStatsVM> {
  const data = await unwrap(apiClient.get<BlockscoutStatsRaw>('/v2/stats'))
  return mapStats(data)
}
