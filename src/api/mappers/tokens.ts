import { formatTokenTotalSupplyDisplay } from '@/utils/tokenAmount'
import type { BlockscoutListEnvelope, BlockscoutTokenRaw } from '../types'
import type { ExplorerTokenDetailVM, ExplorerTokenListItemVM } from '../view-models'
import { pickNextPageParams } from './common'
import type { PaginatedVM } from '../view-models'
import { mapTokenTransferList } from './transactions'

function tokenContractAddress(r: BlockscoutTokenRaw): string {
  return (r.address ?? r.address_hash ?? '').trim()
}

function num(v: string | number | null | undefined): number | null {
  if (v == null) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function mapTokenListItem(r: BlockscoutTokenRaw): ExplorerTokenListItemVM {
  const decimals = num(r.decimals)
  const supplyRaw = r.total_supply != null ? String(r.total_supply) : null
  return {
    address: tokenContractAddress(r),
    name: r.name ?? null,
    symbol: r.symbol ?? null,
    holders: num(r.holders_count),
    transfers: num(r.transfers_count),
    totalSupply: formatTokenTotalSupplyDisplay(supplyRaw, decimals),
    decimals,
  }
}

export function mapTokenListResponse(raw: BlockscoutListEnvelope<BlockscoutTokenRaw>): PaginatedVM<ExplorerTokenListItemVM> {
  return {
    items: (raw.items ?? []).map(mapTokenListItem),
    nextPageParams: pickNextPageParams(raw),
  }
}

export function mapTokenDetail(raw: unknown): ExplorerTokenDetailVM {
  const r = raw as BlockscoutTokenRaw
  const decimals = num(r.decimals)
  const supplyRaw = r.total_supply != null ? String(r.total_supply) : null
  return {
    address: tokenContractAddress(r),
    name: r.name ?? null,
    symbol: r.symbol ?? null,
    decimals,
    totalSupply: formatTokenTotalSupplyDisplay(supplyRaw, decimals),
    holdersCount: num(r.holders_count),
    transfersCount: num(r.transfers_count),
  }
}

export function mapTokenTransfersResponse(raw: BlockscoutListEnvelope<unknown>) {
  return mapTokenTransferList(raw)
}
