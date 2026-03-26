import type { NextPageParams } from '@/api/types'

export function stableStringifyParams(p: NextPageParams): string {
  if (p == null) return 'null'
  const keys = Object.keys(p).sort()
  return JSON.stringify(keys.map((k) => [k, p[k]]))
}

export function keysetHasNext(next: NextPageParams): boolean {
  return next != null && typeof next === 'object' && Object.keys(next).length > 0
}
