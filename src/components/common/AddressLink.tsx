import { Link } from 'react-router-dom'
import { shortenAddress } from '@/utils/address'
import clsx from 'clsx'

export function AddressLink({
  address,
  shorten = true,
  className,
}: {
  address: string | null | undefined
  shorten?: boolean
  className?: string
}) {
  if (!address) return <span className="text-slate-400">—</span>
  const label = shorten ? shortenAddress(address) : address
  return (
    <Link to={`/address/${address}`} className={clsx('font-mono text-accent', className)} title={address}>
      {label}
    </Link>
  )
}
