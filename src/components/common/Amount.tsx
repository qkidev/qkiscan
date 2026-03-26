import { getNativeSymbol } from '@/config/nativeToken'
import { formatWeiToDecimal } from '@/utils/number'

export function Amount({ wei, decimals = 18 }: { wei: string | null | undefined; decimals?: number }) {
  if (wei == null || wei === '') return <span className="text-slate-400">—</span>
  const symbol = getNativeSymbol()
  return (
    <span className="font-mono tabular-nums">
      {formatWeiToDecimal(wei, decimals)}
      {symbol ? ` ${symbol}` : ''}
    </span>
  )
}
