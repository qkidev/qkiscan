import { isAddress } from './address'
import { looksLikeTxHash } from './hash'

export function isBlockHeightString(value: string): boolean {
  return /^\d+$/.test(value.trim()) && Number(value) >= 0
}

export function classifySearchInput(raw: string): 'address' | 'tx' | 'block_height' | 'unknown' {
  const v = raw.trim()
  if (!v) return 'unknown'
  if (isAddress(v)) return 'address'
  if (looksLikeTxHash(v)) return 'tx'
  if (isBlockHeightString(v)) return 'block_height'
  return 'unknown'
}
