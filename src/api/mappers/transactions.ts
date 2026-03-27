import type { BlockscoutListEnvelope, BlockscoutTransactionItemRaw } from '../types'
import type {
  ExplorerInternalTxVM,
  ExplorerLogVM,
  ExplorerTokenTransferVM,
  ExplorerTransactionDetailVM,
  ExplorerTransactionListItemVM,
} from '../view-models'
import { addressFromField, parseTxStatus, pickNextPageParams } from './common'
import { formatNativeTransactionFee, normalizeAmountLike, normalizeTokenTransferAmount } from '@/utils/tokenAmount'
import type { PaginatedVM } from '../view-models'

function feeStr(r: BlockscoutTransactionItemRaw): string | null {
  return formatNativeTransactionFee(r.fee)
}

export function mapTxListItem(r: BlockscoutTransactionItemRaw): ExplorerTransactionListItemVM {
  return {
    hash: r.hash ?? '',
    blockNumber:
      r.block_number != null ? String(r.block_number) : r.block != null ? String(r.block) : null,
    timestampIso: r.timestamp ?? null,
    from: addressFromField(r.from),
    to: addressFromField(r.to),
    status: parseTxStatus(r),
    method: r.method ?? r.type ?? null,
    valueWei: normalizeAmountLike(r.value),
    fee: feeStr(r),
  }
}

export function mapTxDetail(raw: unknown): ExplorerTransactionDetailVM {
  const r = raw as Record<string, unknown>
  const from = addressFromField(r.from as BlockscoutTransactionItemRaw['from'])
  const to = addressFromField(r.to as BlockscoutTransactionItemRaw['to'])
  const status = parseTxStatus(r as BlockscoutTransactionItemRaw)
  return {
    hash: String(r.hash ?? ''),
    blockNumber:
      r.block_number != null
        ? String(r.block_number)
        : r.block != null
          ? String(r.block)
          : null,
    timestampIso: (r.timestamp as string | null) ?? null,
    from,
    to,
    status,
    nonce: typeof r.nonce === 'number' ? r.nonce : null,
    valueWei: normalizeAmountLike(r.value),
    gasPrice: (r.gas_price as string | undefined) ?? null,
    gasUsed: (r.gas_used as string | undefined) ?? null,
    gasLimit: (r.gas_limit as string | undefined) ?? null,
    maxFeePerGas: (r.max_fee_per_gas as string | undefined) ?? null,
    maxPriorityFeePerGas: (r.max_priority_fee_per_gas as string | undefined) ?? null,
    fee: feeStr(r as BlockscoutTransactionItemRaw),
    input: (r.raw_input as string | undefined) ?? (r.input as string | undefined) ?? null,
    confirmations: typeof r.confirmations === 'number' ? r.confirmations : null,
  }
}

export function mapTxListResponse(
  raw: BlockscoutListEnvelope<BlockscoutTransactionItemRaw>,
): PaginatedVM<ExplorerTransactionListItemVM> {
  return {
    items: (raw.items ?? []).map(mapTxListItem),
    nextPageParams: pickNextPageParams(raw),
  }
}

function tokenTransferMethod(r: Record<string, unknown>): string | null {
  const m = r.method
  if (m != null && m !== '') {
    if (typeof m === 'string') return m.trim() || null
    if (typeof m === 'number' || typeof m === 'boolean') return String(m)
  }
  const t = r.type
  if (typeof t === 'string' && t.trim() !== '') return t.trim()
  return null
}

/** Blockscout v2 多在 `token` 内返回 symbol / address_hash，与顶层 token_symbol 并存 */
function tokenSymbolFromTransfer(r: Record<string, unknown>): string | null {
  const top = r.token_symbol ?? r.symbol
  if (typeof top === 'string' && top.trim() !== '') return top.trim()
  const tok = r.token
  if (tok && typeof tok === 'object') {
    const t = tok as Record<string, unknown>
    const sym = t.symbol
    if (typeof sym === 'string' && sym.trim() !== '') return sym.trim()
    const name = t.name
    if (typeof name === 'string' && name.trim() !== '') return name.trim()
  }
  return null
}

function tokenAddressFromTransfer(r: Record<string, unknown>): string | null {
  if (typeof r.token_address === 'string' && r.token_address.trim() !== '') return r.token_address.trim()
  const tok = r.token
  if (tok && typeof tok === 'object') {
    const t = tok as Record<string, unknown>
    const ah = t.address_hash ?? t.address
    if (typeof ah === 'string' && ah.trim() !== '') return ah.trim()
  }
  return null
}

export function mapTokenTransferItem(raw: unknown): ExplorerTokenTransferVM {
  const r = raw as Record<string, unknown>
  const ts = r.timestamp
  return {
    transactionHash: (r.transaction_hash as string | undefined) ?? (r.tx_hash as string | undefined) ?? null,
    timestampIso: typeof ts === 'string' && ts.trim() !== '' ? ts : null,
    method: tokenTransferMethod(r),
    from: addressFromField(r.from as BlockscoutTransactionItemRaw['from']),
    to: addressFromField(r.to as BlockscoutTransactionItemRaw['to']),
    amountRaw:
      normalizeTokenTransferAmount(r.total, r.token) ??
      normalizeAmountLike(r.value) ??
      normalizeAmountLike(r.total),
    tokenSymbol: tokenSymbolFromTransfer(r),
    tokenAddress: tokenAddressFromTransfer(r),
    type: (r.type as string | undefined) ?? null,
  }
}

export function mapTokenTransferList(raw: BlockscoutListEnvelope<unknown>): PaginatedVM<ExplorerTokenTransferVM> {
  return {
    items: (raw.items ?? []).map(mapTokenTransferItem),
    nextPageParams: pickNextPageParams(raw),
  }
}

export function mapLogItem(raw: unknown): ExplorerLogVM {
  const r = raw as Record<string, unknown>
  const topics = r.decoded_topics ?? r.topics
  const addr =
    (typeof r.address_hash === 'string' ? r.address_hash : null) ??
    addressFromField(r.address as Parameters<typeof addressFromField>[0]) ??
    null
  return {
    address: addr,
    data: (r.data as string | undefined) ?? null,
    index: typeof r.index === 'number' ? r.index : null,
    topics: Array.isArray(topics) ? topics.map(String) : null,
    txHash: (r.transaction_hash as string | undefined) ?? null,
  }
}

export function mapLogList(raw: BlockscoutListEnvelope<unknown>): PaginatedVM<ExplorerLogVM> {
  return {
    items: (raw.items ?? []).map(mapLogItem),
    nextPageParams: pickNextPageParams(raw),
  }
}

export function mapInternalTxItem(raw: unknown): ExplorerInternalTxVM {
  const r = raw as Record<string, unknown>
  return {
    transactionHash: (r.transaction_hash as string | undefined) ?? null,
    type: (r.type as string | undefined) ?? null,
    from: addressFromField(r.from as BlockscoutTransactionItemRaw['from']),
    to: addressFromField(r.to as BlockscoutTransactionItemRaw['to']),
    value: (r.value as string | undefined) ?? null,
    success: typeof r.success === 'boolean' ? r.success : null,
  }
}

export function mapInternalTxList(raw: BlockscoutListEnvelope<unknown>): PaginatedVM<ExplorerInternalTxVM> {
  return {
    items: (raw.items ?? []).map(mapInternalTxItem),
    nextPageParams: pickNextPageParams(raw),
  }
}
