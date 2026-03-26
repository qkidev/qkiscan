import { apiClient, unwrap } from './client'
import type { BlockscoutListEnvelope, BlockscoutTransactionItemRaw, NextPageParams } from './types'
import {
  mapAddress,
  mapAddressCounters,
  mapAddressInternalTxs,
  mapAddressLogs,
  mapAddressTokenTransfers,
  mapAddressTransactions,
  mapTokenBalanceList,
} from './mappers/addresses'
import type {
  ExplorerAddressCountersVM,
  ExplorerAddressVM,
  ExplorerInternalTxVM,
  ExplorerLogVM,
  ExplorerTokenBalanceVM,
  ExplorerTokenTransferVM,
  ExplorerTransactionListItemVM,
} from './view-models'
import type { PaginatedVM } from './view-models'

function mergeParams(next?: NextPageParams): Record<string, unknown> | undefined {
  if (!next || Object.keys(next).length === 0) return undefined
  return { ...next }
}

export async function getAddress(address: string): Promise<ExplorerAddressVM> {
  const encoded = encodeURIComponent(address)
  const raw = await unwrap(apiClient.get<unknown>(`/v2/addresses/${encoded}`))
  return mapAddress(raw)
}

export async function getAddressCounters(address: string): Promise<ExplorerAddressCountersVM> {
  const encoded = encodeURIComponent(address)
  const raw = await unwrap(apiClient.get<unknown>(`/v2/addresses/${encoded}/counters`))
  return mapAddressCounters(raw)
}

export async function getAddressTransactions(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTransactionListItemVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<BlockscoutTransactionItemRaw>>(
      `/v2/addresses/${encoded}/transactions`,
      { params: mergeParams(next) },
    ),
  )
  return mapAddressTransactions(data)
}

export async function getAddressTokenTransfers(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTokenTransferVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/addresses/${encoded}/token-transfers`, {
      params: mergeParams(next),
    }),
  )
  return mapAddressTokenTransfers(data)
}

export async function getAddressInternalTxs(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerInternalTxVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/addresses/${encoded}/internal-transactions`, {
      params: mergeParams(next),
    }),
  )
  return mapAddressInternalTxs(data)
}

export async function getAddressLogs(address: string, next?: NextPageParams): Promise<PaginatedVM<ExplorerLogVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/addresses/${encoded}/logs`, {
      params: mergeParams(next),
    }),
  )
  return mapAddressLogs(data)
}

export async function getAddressTokenBalances(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTokenBalanceVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/addresses/${encoded}/token-balances`, {
      params: mergeParams(next),
    }),
  )
  return mapTokenBalanceList(data)
}
