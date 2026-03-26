import type { BlockscoutAddressRaw, BlockscoutListEnvelope } from '../types'
import type {
  ExplorerAddressCountersVM,
  ExplorerAddressVM,
  ExplorerTokenBalanceVM,
} from '../view-models'
import { pickNextPageParams } from './common'
import type { PaginatedVM } from '../view-models'
import type { BlockscoutTransactionItemRaw } from '../types'
import { mapInternalTxList, mapLogList, mapTokenTransferList, mapTxListResponse } from './transactions'

export function mapAddress(raw: unknown): ExplorerAddressVM {
  const r = raw as BlockscoutAddressRaw
  return {
    hash: r.hash ?? '',
    name: r.name ?? null,
    balanceWei: r.coin_balance ?? null,
    isContract: Boolean(r.is_contract),
  }
}

export function mapAddressCounters(raw: unknown): ExplorerAddressCountersVM {
  const r = raw as Record<string, unknown>
  return {
    transactionsCount:
      typeof r.transactions_count === 'number'
        ? r.transactions_count
        : typeof r.transaction_count === 'number'
          ? r.transaction_count
          : null,
    tokenTransfersCount:
      typeof r.token_transfers_count === 'number'
        ? r.token_transfers_count
        : typeof r.token_transfer_count === 'number'
          ? r.token_transfer_count
          : null,
  }
}

export function mapTokenBalanceItem(raw: unknown): ExplorerTokenBalanceVM {
  const r = raw as Record<string, unknown>
  const token = r.token as { address_hash?: string; name?: string } | undefined
  return {
    token: token?.address_hash ?? (r.token_address as string | undefined) ?? null,
    value: (r.value as string | undefined) ?? null,
    tokenId: (r.token_id as string | undefined) ?? null,
  }
}

export function mapTokenBalanceList(raw: BlockscoutListEnvelope<unknown>): PaginatedVM<ExplorerTokenBalanceVM> {
  return {
    items: (raw.items ?? []).map(mapTokenBalanceItem),
    nextPageParams: pickNextPageParams(raw),
  }
}

export function mapAddressTransactions(raw: BlockscoutListEnvelope<BlockscoutTransactionItemRaw>) {
  return mapTxListResponse(raw)
}

export function mapAddressTokenTransfers(raw: BlockscoutListEnvelope<unknown>) {
  return mapTokenTransferList(raw)
}

export function mapAddressInternalTxs(raw: BlockscoutListEnvelope<unknown>) {
  return mapInternalTxList(raw)
}

export function mapAddressLogs(raw: BlockscoutListEnvelope<unknown>) {
  return mapLogList(raw)
}
