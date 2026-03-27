/** 接口偶发返回 JSON 字符串或双重 JSON 字符串，解析后再做树状展示 */
export function normalizeJsonValue(data: unknown): unknown {
  let cur: unknown = data
  for (let i = 0; i < 3; i++) {
    if (typeof cur !== 'string') break
    const s = cur.trim()
    if (s.length === 0) break
    const first = s[0]
    if (first !== '{' && first !== '[' && first !== '"') break
    try {
      cur = JSON.parse(s) as unknown
    } catch {
      break
    }
  }
  return cur
}
