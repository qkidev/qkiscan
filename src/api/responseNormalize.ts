/**
 * Blockscout `/v2/main-page/*` 多数版本直接返回 **数组**；
 * 若遇包装形态 `{ items: [...] }` 也兼容。
 */
export function asItemArray<T>(data: T[] | { items?: T[] } | null | undefined): T[] {
  if (data == null) return []
  if (Array.isArray(data)) return data
  return data.items ?? []
}
