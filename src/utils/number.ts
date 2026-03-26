/** 等价于 ethers/viem formatUnits，避免依赖 viem 源码与 TS 5.x 配置冲突 */
function formatUnits(value: bigint, decimals: number): string {
  if (decimals < 0) throw new Error('invalid decimals')
  const base = 10n ** BigInt(decimals)
  const negative = value < 0n
  const v = negative ? -value : value
  const whole = v / base
  const fraction = v % base
  const fracStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
  const s = fracStr ? `${whole.toString()}.${fracStr}` : whole.toString()
  return negative ? `-${s}` : s
}

export function formatWeiToDecimal(
  wei: string | null | undefined,
  decimals = 18,
  /** 小数部分最多保留位数（再经 trim），代币转账等场景建议 18 */
  maxFractionDigits = 8,
): string {
  if (wei == null || wei === '') return '—'
  try {
    const s = formatUnits(BigInt(wei), decimals)
    return formatThousandsTrim(s, maxFractionDigits)
  } catch {
    return wei
  }
}

/** Gas 相关字段（gas_price、max_fee_per_gas 等）接口多为 wei 整数字符串，展示为 gwei */
export function formatWeiToGwei(wei: string | null | undefined): string {
  if (wei == null || wei === '') return '—'
  try {
    const s = formatUnits(BigInt(wei), 9)
    return `${formatThousandsTrim(s)} gwei`
  } catch {
    return wei
  }
}

/** 千分位，避免过长小数全零 */
export function formatThousandsTrim(s: string, maxFraction = 8): string {
  const n = Number(s)
  if (!Number.isFinite(n)) return s
  if (Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-8)) {
    return n.toExponential(4)
  }
  const parts = s.split('.')
  const intPart = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (parts.length === 1) return intPart
  let frac = parts[1]!
  if (frac.length > maxFraction) frac = frac.slice(0, maxFraction).replace(/0+$/, '')
  return frac.length ? `${intPart}.${frac}` : intPart
}
