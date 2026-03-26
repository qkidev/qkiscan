import { apiClient, unwrap } from './client'
import type { BlockscoutBlockItemRaw, BlockscoutListEnvelope, BlockscoutTransactionItemRaw } from './types'
import type { NextPageParams } from './types'
import { mapBlockDetail, mapBlockListResponse, mapBlockListItem } from './mappers/blocks'
import { mapTxListResponse } from './mappers/transactions'
import type { ExplorerBlockDetailVM, ExplorerBlockListItemVM } from './view-models'
import type { PaginatedVM } from './view-models'
import type { ExplorerTransactionListItemVM } from './view-models'
import { asItemArray } from './responseNormalize'

function mergeParams(base?: Record<string, unknown>, next?: NextPageParams): Record<string, unknown> | undefined {
  if (!next || Object.keys(next).length === 0) return base
  return { ...base, ...next }
}

/** 首页最新区块 */
export async function getMainPageBlocks(): Promise<ExplorerBlockListItemVM[]> {
  const data = await unwrap(
    apiClient.get<BlockscoutBlockItemRaw[] | BlockscoutListEnvelope<BlockscoutBlockItemRaw>>('/v2/main-page/blocks'),
  )
  return asItemArray(data).map(mapBlockListItem)
}

/** 区块列表（keyset） */
export async function getBlocks(next?: NextPageParams): Promise<PaginatedVM<ExplorerBlockListItemVM>> {
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<BlockscoutBlockItemRaw>>('/v2/blocks', {
      params: mergeParams(undefined, next),
    }),
  )
  return mapBlockListResponse(data)
}

/** 区块详情（高度或哈希） */
export async function getBlock(heightOrHash: string): Promise<ExplorerBlockDetailVM> {
  const encoded = encodeURIComponent(heightOrHash)
  const raw = await unwrap(apiClient.get<unknown>(`/v2/blocks/${encoded}`))
  return mapBlockDetail(raw)
}

/** 区块内交易 */
export async function getBlockTransactions(
  heightOrHash: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTransactionListItemVM>> {
  const encoded = encodeURIComponent(heightOrHash)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<BlockscoutTransactionItemRaw>>(
      `/v2/blocks/${encoded}/transactions`,
      { params: mergeParams(undefined, next) },
    ),
  )
  return mapTxListResponse(data)
}
