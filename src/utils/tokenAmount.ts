import { formatWeiToDecimal } from './number'

/**
 * Blockscout 部分接口将代币数量表示为 `{ decimals, value }`（value 多为整数字符串），
 * 需规范为可展示的十进制字符串，避免把对象直接交给 React 渲染。
 */
export function normalizeAmountLike(raw: unknown): string | null {
  if (raw == null) return null
  if (typeof raw === 'string') return raw === '' ? null : raw
  if (typeof raw === 'number') return Number.isFinite(raw) ? String(raw) : null
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    const o = raw as { value?: unknown; decimals?: unknown }
    const v = o.value
    if (v == null) return null
    const valStr = typeof v === 'string' || typeof v === 'number' ? String(v) : null
    if (valStr == null) return null
    const decRaw = o.decimals
    if (decRaw !== undefined && decRaw !== null) {
      const d = typeof decRaw === 'number' ? decRaw : parseInt(String(decRaw), 10)
      if (Number.isFinite(d) && d >= 0) {
        return formatWeiToDecimal(valStr, d)
      }
    }
    return valStr
  }
  return null
}

function readTokenDecimals(token: unknown): number | null {
  if (!token || typeof token !== 'object') return null
  const t = token as Record<string, unknown>
  const d = t.decimals
  if (typeof d === 'number' && Number.isFinite(d) && d >= 0) return Math.floor(d)
  if (typeof d === 'string') {
    const n = parseInt(d, 10)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}

/**
 * 代币转账 `total`：Blockscout 常在 `total` 内只给 `value`，`decimals` 在嵌套 `token` 上。
 * 展示小数位数用 18，避免与首页/其他处默认 8 位截断不一致。
 */
export function normalizeTokenTransferAmount(total: unknown, token: unknown): string | null {
  const tokenDec = readTokenDecimals(token)

  if (total == null) return null

  if (typeof total === 'string') {
    if (total === '') return null
    if (tokenDec != null) return formatWeiToDecimal(total, tokenDec, 18)
    return total
  }

  if (typeof total === 'number') {
    return Number.isFinite(total) ? String(total) : null
  }

  if (typeof total === 'object' && total !== null && 'value' in total) {
    const o = total as { value?: unknown; decimals?: unknown }
    const v = o.value
    if (v == null) return null
    const valStr = typeof v === 'string' || typeof v === 'number' ? String(v) : null
    if (valStr == null) return null

    let decimals: number | null = null
    const decRaw = o.decimals
    if (decRaw !== undefined && decRaw !== null) {
      decimals = typeof decRaw === 'number' ? decRaw : parseInt(String(decRaw), 10)
    } else if (tokenDec != null) {
      decimals = tokenDec
    }

    if (decimals != null && Number.isFinite(decimals) && decimals >= 0) {
      return formatWeiToDecimal(valStr, Math.floor(decimals), 18)
    }
    return valStr
  }

  return null
}

/**
 * `total_supply` 在 Blockscout 中一般为最小单位整数字符串，需按代币 decimals 换算为可读十进制。
 * 未提供 decimals 时默认按 18（常见 ERC-20）。
 */
export function formatTokenTotalSupplyDisplay(
  raw: string | null | undefined,
  decimals: number | null | undefined,
): string | null {
  if (raw == null || raw === '') return null
  const d =
    decimals != null && Number.isFinite(decimals) && decimals >= 0 ? Math.floor(Number(decimals)) : 18
  const out = formatWeiToDecimal(raw, d)
  return out === '—' ? null : out
}

const NATIVE_DECIMALS = 18

/**
 * 交易手续费（原生币）：Blockscout 多为 wei 整数字符串，或 `fee: { value }` 未带 decimals 时按 18 位换算。
 * 若对象含 `decimals` 与 `value`，则按 `normalizeAmountLike` 处理。
 */
export function formatNativeTransactionFee(fee: unknown): string | null {
  if (fee == null) return null
  if (typeof fee === 'string') {
    return fee === '' ? null : formatWeiToDecimal(fee, NATIVE_DECIMALS)
  }
  if (typeof fee === 'object' && fee !== null) {
    const o = fee as { value?: unknown; decimals?: unknown }
    if (o.decimals != null && o.value != null) {
      return normalizeAmountLike(fee)
    }
    if (typeof o.value === 'string') {
      return formatWeiToDecimal(o.value, NATIVE_DECIMALS)
    }
  }
  return null
}
