import type { BlockscoutBlockItemRaw, BlockscoutListEnvelope } from '../types'
import type { ExplorerBlockDetailVM, ExplorerBlockListItemVM } from '../view-models'
import { pickNextPageParams } from './common'
import type { PaginatedVM } from '../view-models'

function heightStr(r: BlockscoutBlockItemRaw): string {
  const h = r.height ?? r.block_number
  if (h === undefined || h === null) return ''
  return String(h)
}

export function mapBlockListItem(r: BlockscoutBlockItemRaw): ExplorerBlockListItemVM {
  const miner = r.miner
  const minerAddr =
    typeof miner === 'string' ? miner : miner && typeof miner === 'object' ? miner.hash ?? null : null
  const minerName =
    miner && typeof miner === 'object' && 'name' in miner && typeof miner.name === 'string'
      ? miner.name
      : null
  return {
    height: heightStr(r),
    hash: r.hash ?? '',
    timestampIso: r.timestamp ?? null,
    txCount: typeof r.transactions_count === 'number' ? r.transactions_count : typeof r.tx_count === 'number' ? r.tx_count : null,
    gasUsed: r.gas_used ?? null,
    gasLimit: r.gas_limit ?? null,
    minerAddress: minerAddr,
    minerName,
  }
}

export function mapBlockDetail(raw: unknown): ExplorerBlockDetailVM {
  const r = raw as Record<string, unknown>
  const miner = r.miner as BlockscoutBlockItemRaw['miner']
  const minerAddr =
    typeof miner === 'string' ? miner : miner && typeof miner === 'object' ? (miner as { hash?: string }).hash ?? null : null
  const minerName =
    miner && typeof miner === 'object' && 'name' in miner && typeof (miner as { name?: string }).name === 'string'
      ? (miner as { name: string }).name
      : null
  return {
    height: String(r.height ?? r.block_number ?? ''),
    hash: String(r.hash ?? ''),
    timestampIso: (r.timestamp as string | null) ?? null,
    parentHash: (r.parent_hash as string | undefined) ?? null,
    txCount:
      typeof r.transactions_count === 'number'
        ? r.transactions_count
        : typeof r.tx_count === 'number'
          ? r.tx_count
          : null,
    gasLimit: (r.gas_limit as string | undefined) ?? null,
    gasUsed: (r.gas_used as string | undefined) ?? null,
    baseFeePerGas: (r.base_fee_per_gas as string | undefined) ?? null,
    burntFees: (r.burnt_fees as string | undefined) ?? null,
    minerAddress: minerAddr,
    minerName,
  }
}

export function mapBlockListResponse(raw: BlockscoutListEnvelope<BlockscoutBlockItemRaw>): PaginatedVM<ExplorerBlockListItemVM> {
  return {
    items: (raw.items ?? []).map(mapBlockListItem),
    nextPageParams: pickNextPageParams(raw),
  }
}
