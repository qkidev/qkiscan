import { apiClient, unwrap } from './client'
import type { BlockscoutSearchItemRaw } from './types'
import type { ExplorerSearchResultVM } from './view-models'

function mapSearchItem(r: BlockscoutSearchItemRaw, index: number): ExplorerSearchResultVM {
  const type = (r.type ?? 'unknown').toLowerCase()
  if (type.includes('address') && r.address_hash) {
    return {
      type: 'address',
      title: r.address_hash,
      href: `/address/${r.address_hash}`,
      subtitle: r.name ?? null,
    }
  }
  if (type.includes('block') && r.block_hash) {
    return {
      type: 'block',
      title: String(r.block_number ?? r.block_hash),
      href: `/blocks/${r.block_hash}`,
      subtitle: null,
    }
  }
  if (type.includes('transaction') && r.transaction_hash) {
    return {
      type: 'transaction',
      title: r.transaction_hash,
      href: `/tx/${r.transaction_hash}`,
      subtitle: null,
    }
  }
  if (type.includes('token') && r.address_hash) {
    return {
      type: 'token',
      title: r.name ?? r.symbol ?? r.address_hash,
      href: `/token/${r.address_hash}`,
      subtitle: r.symbol ?? null,
    }
  }
  return {
    type: type || 'unknown',
    title: r.name ?? r.address_hash ?? r.transaction_hash ?? `item-${index}`,
    href: '/search',
    subtitle: null,
  }
}

export async function search(query: string): Promise<ExplorerSearchResultVM[]> {
  const q = query.trim()
  if (!q) return []
  const data = await unwrap(
    apiClient.get<{ items?: BlockscoutSearchItemRaw[] }>('/v2/search', {
      params: { q },
    }),
  )
  return (data.items ?? []).map((item, i) => mapSearchItem(item, i))
}
