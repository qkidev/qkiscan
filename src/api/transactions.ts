import { apiClient, unwrap } from './client'
import type { BlockscoutListEnvelope, BlockscoutTransactionItemRaw, NextPageParams } from './types'
import {
  mapInternalTxList,
  mapLogList,
  mapTokenTransferList,
  mapTxDetail,
  mapTxListItem,
  mapTxListResponse,
} from './mappers/transactions'
import type {
  ExplorerInternalTxVM,
  ExplorerLogVM,
  ExplorerTokenTransferVM,
  ExplorerTransactionDetailVM,
  ExplorerTransactionListItemVM,
} from './view-models'
import type { PaginatedVM } from './view-models'
import { asItemArray } from './responseNormalize'

function mergeParams(next?: NextPageParams): Record<string, unknown> | undefined {
  if (!next || Object.keys(next).length === 0) return undefined
  return { ...next }
}

/** 首页最新交易 */
export async function getMainPageTransactions(): Promise<ExplorerTransactionListItemVM[]> {
  const data = await unwrap(
    apiClient.get<BlockscoutTransactionItemRaw[] | BlockscoutListEnvelope<BlockscoutTransactionItemRaw>>(
      '/v2/main-page/transactions',
    ),
  )
  return asItemArray(data).map(mapTxListItem)
}

/** 交易列表 */
export async function getTransactions(next?: NextPageParams): Promise<PaginatedVM<ExplorerTransactionListItemVM>> {
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<BlockscoutTransactionItemRaw>>('/v2/transactions', {
      params: mergeParams(next),
    }),
  )
  return mapTxListResponse(data)
}

/** 交易详情 */
export async function getTransaction(hash: string): Promise<ExplorerTransactionDetailVM> {
  const encoded = encodeURIComponent(hash)
  const raw = await unwrap(apiClient.get<unknown>(`/v2/transactions/${encoded}`))
  return mapTxDetail(raw)
}

/** Token transfers */
export async function getTransactionTokenTransfers(
  hash: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTokenTransferVM>> {
  const encoded = encodeURIComponent(hash)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/transactions/${encoded}/token-transfers`, {
      params: mergeParams(next),
    }),
  )
  return mapTokenTransferList(data)
}

/** Logs */
export async function getTransactionLogs(hash: string, next?: NextPageParams): Promise<PaginatedVM<ExplorerLogVM>> {
  const encoded = encodeURIComponent(hash)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/transactions/${encoded}/logs`, {
      params: mergeParams(next),
    }),
  )
  return mapLogList(data)
}

/** Internal txs */
export async function getTransactionInternalTxs(
  hash: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerInternalTxVM>> {
  const encoded = encodeURIComponent(hash)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/transactions/${encoded}/internal-transactions`, {
      params: mergeParams(next),
    }),
  )
  return mapInternalTxList(data)
}

/** State changes */
export async function getTransactionStateChanges(hash: string, next?: NextPageParams): Promise<unknown> {
  const encoded = encodeURIComponent(hash)
  return unwrap(
    apiClient.get<unknown>(`/v2/transactions/${encoded}/state-changes`, {
      params: mergeParams(next),
    }),
  )
}
