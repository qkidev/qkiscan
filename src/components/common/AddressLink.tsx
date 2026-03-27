import { Link } from 'react-router-dom'
import { shortenAddress } from '@/utils/address'
import clsx from 'clsx'
import { CopyIconButton } from '@/components/common/CopyIconButton'

export function AddressLink({
  address,
  label,
  shorten = true,
  className,
  showCopy = true,
}: {
  address: string | null | undefined
  /** 展示文案（例如 name），复制仍使用 address */
  label?: string | null
  shorten?: boolean
  className?: string
  /** 是否在地址链接后显示复制图标 */
  showCopy?: boolean
}) {
  if (!address) return <span className="text-slate-400">—</span>
  const text = (label ?? '').trim() || (shorten ? shortenAddress(address) : address)
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1">
      <Link to={`/address/${address}`} className={clsx('min-w-0 font-mono text-accent', className)} title={address}>
        {text}
      </Link>
      {showCopy ? <CopyIconButton text={address} /> : null}
    </span>
  )
}
