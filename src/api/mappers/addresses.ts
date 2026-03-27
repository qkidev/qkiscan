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
import { normalizeAmountLike } from '@/utils/tokenAmount'
import { asItemArray } from '../responseNormalize'

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
  const count = (v: unknown): string | null => {
    if (typeof v === 'string') return v
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
    return null
  }
  return {
    transactionsCount: count(r.transactions_count) ?? count(r.transaction_count),
    tokenTransfersCount: count(r.token_transfers_count) ?? count(r.token_transfer_count),
    gasUsageCount: count(r.gas_usage_count),
  }
}

export function mapTokenBalanceItem(raw: unknown): ExplorerTokenBalanceVM {
  const r = raw as Record<string, unknown>
  const token = r.token as { address_hash?: string; address?: string; hash?: string; name?: string } | undefined
  return {
    token:
      token?.address_hash ??
      token?.address ??
      token?.hash ??
      (r.token_address as string | undefined) ??
      (r.token as string | undefined) ??
      null,
    value: normalizeAmountLike(r.value),
    tokenId: (r.token_id as string | undefined) ?? null,
  }
}

export function mapTokenBalanceList(
  raw: BlockscoutListEnvelope<unknown> | unknown[] | null | undefined,
): PaginatedVM<ExplorerTokenBalanceVM> {
  const items = asItemArray(raw as unknown[] | { items?: unknown[] } | null | undefined)
  const nextPageParams = Array.isArray(raw) ? null : pickNextPageParams((raw ?? {}) as BlockscoutListEnvelope<unknown>)
  return {
    items: items.map(mapTokenBalanceItem),
    nextPageParams,
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
