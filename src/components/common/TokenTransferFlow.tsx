import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ExplorerTokenTransferVM } from '@/api/view-models'
import { AddressLink } from '@/components/common/AddressLink'

/** 官方风格：from → to for 数额 代币 */
export function TokenTransferFlowList({
  items,
  className,
}: {
  items: ExplorerTokenTransferVM[]
  className?: string
}) {
  const { t } = useTranslation('tx')

  if (items.length === 0) return null

  return (
    <ul className={className ?? 'space-y-2'}>
      {items.map((row, i) => (
        <li
          key={`${row.transactionHash ?? 'tt'}-${row.from ?? ''}-${row.to ?? ''}-${row.tokenAddress ?? ''}-${i}`}
          className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm"
        >
          <AddressLink address={row.from} label={row.fromName} />
          <span className="text-slate-400" aria-hidden>
            →
          </span>
          <AddressLink address={row.to} label={row.toName} />
          <span className="text-slate-500">{t('tokenTransfer.for')}</span>
          <TokenTransferAmount row={row} />
        </li>
      ))}
    </ul>
  )
}

export function TokenTransferAmount({ row }: { row: ExplorerTokenTransferVM }) {
  const amount = row.amountRaw ?? '—'
  const symbol = row.tokenSymbol ?? (row.tokenAddress ? row.tokenAddress : null)

  if (!symbol) {
    return <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">{amount}</span>
  }

  if (!row.tokenAddress) {
    return (
      <span className="tabular-nums">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{amount}</span>{' '}
        <span className="text-accent">{symbol}</span>
      </span>
    )
  }

  return (
    <span className="tabular-nums">
      <span className="font-semibold text-slate-900 dark:text-slate-100">{amount}</span>{' '}
      <Link className="text-accent hover:underline" to={`/token/${row.tokenAddress}`}>
        {symbol}
      </Link>
    </span>
  )
}
