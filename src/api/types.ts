/**
 * Blockscout REST API 原始类型（宽松，兼容多版本；页面禁止直接使用，须经 mapper）
 */

export type NextPageParams = Record<string, string | number | boolean> | null | undefined

export interface BlockscoutListEnvelope<T> {
  items?: T[]
  next_page_params?: NextPageParams
}

export interface BlockscoutTransactionItemRaw {
  hash?: string
  block?: number | null
  block_number?: number | null
  timestamp?: string | null
  from?: { hash?: string } | { hash?: string }[] | string
  to?: { hash?: string } | { hash?: string }[] | string | null
  status?: string | null
  result?: string | null
  method?: string | null
  type?: string | null
  value?: string | null
  fee?: { value?: string | null; type?: string | null } | string | null
  gas_price?: string | null
  gas_used?: string | null
  nonce?: number | null
  confirmations?: number | null
  [key: string]: unknown
}

export interface BlockscoutBlockItemRaw {
  height?: number | string
  block_number?: number | string
  hash?: string
  timestamp?: string | null
  transactions_count?: number | null
  tx_count?: number | null
  gas_limit?: string | null
  gas_used?: string | null
  miner?: { hash?: string; name?: string } | string | null
  [key: string]: unknown
}

export interface BlockscoutAddressRaw {
  hash?: string
  name?: string | null
  coin_balance?: string | null
  exchange_rate?: string | null
  is_contract?: boolean | null
  [key: string]: unknown
}

export interface BlockscoutTokenRaw {
  /** 部分接口用 address，列表接口常用 address_hash */
  address?: string
  address_hash?: string
  name?: string | null
  symbol?: string | null
  decimals?: string | number | null
  total_supply?: string | null
  holders_count?: string | number | null
  transfers_count?: string | number | null
  type?: string | null
  [key: string]: unknown
}

export interface BlockscoutSearchItemRaw {
  type?: string
  address_hash?: string
  block_hash?: string
  block_number?: number | string
  transaction_hash?: string
  name?: string
  symbol?: string
  [key: string]: unknown
}

export interface BlockscoutStatsRaw {
  total_blocks?: string | number | null
  total_transactions?: string | number | null
  total_addresses?: string | number | null
  total_gas_used?: string | null
  [key: string]: unknown
}
