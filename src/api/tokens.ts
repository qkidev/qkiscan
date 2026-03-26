import { normalizeAmountLike } from '@/utils/tokenAmount'
import { addressFromField } from './mappers/common'
import { apiClient, unwrap } from './client'
import type { BlockscoutListEnvelope, BlockscoutTokenRaw, NextPageParams } from './types'
import { mapTokenDetail, mapTokenListResponse, mapTokenTransfersResponse } from './mappers/tokens'
import type { ExplorerTokenDetailVM, ExplorerTokenListItemVM, ExplorerTokenTransferVM } from './view-models'
import type { PaginatedVM } from './view-models'

function mergeParams(next?: NextPageParams): Record<string, unknown> | undefined {
  if (!next || Object.keys(next).length === 0) return undefined
  return { ...next }
}

export async function getTokens(next?: NextPageParams): Promise<PaginatedVM<ExplorerTokenListItemVM>> {
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<BlockscoutTokenRaw>>('/v2/tokens', { params: mergeParams(next) }),
  )
  return mapTokenListResponse(data)
}

export async function getToken(address: string): Promise<ExplorerTokenDetailVM> {
  const encoded = encodeURIComponent(address)
  const raw = await unwrap(apiClient.get<unknown>(`/v2/tokens/${encoded}`))
  return mapTokenDetail(raw)
}

export async function getTokenTransfers(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<ExplorerTokenTransferVM>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/tokens/${encoded}/transfers`, {
      params: mergeParams(next),
    }),
  )
  return mapTokenTransfersResponse(data)
}

export async function getTokenHolders(
  address: string,
  next?: NextPageParams,
): Promise<PaginatedVM<{ address: string; value: string | null }>> {
  const encoded = encodeURIComponent(address)
  const data = await unwrap(
    apiClient.get<BlockscoutListEnvelope<unknown>>(`/v2/tokens/${encoded}/holders`, {
      params: mergeParams(next),
    }),
  )
  return {
    items: (data.items ?? []).map((raw) => {
      const r = raw as Record<string, unknown>
      const addr =
        addressFromField(r.address as Parameters<typeof addressFromField>[0]) ??
        (typeof r.address_hash === 'string' ? r.address_hash : null) ??
        (typeof r.hash === 'string' ? r.hash : null)
      return {
        address: addr ?? '',
        value: normalizeAmountLike(r.value),
      }
    }),
    nextPageParams: data.next_page_params ?? null,
  }
}
