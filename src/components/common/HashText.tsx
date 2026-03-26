import { Link } from 'react-router-dom'
import { shortenHash } from '@/utils/hash'
import clsx from 'clsx'

export function HashText({
  hash,
  to,
  shorten = true,
  className,
}: {
  hash: string | null | undefined
  to?: string
  shorten?: boolean
  className?: string
}) {
  if (!hash) return <span className="text-slate-400">—</span>
  const label = shorten ? shortenHash(hash) : hash
  const inner = <span className={clsx('font-mono', className)}>{label}</span>
  if (to) {
    return (
      <Link to={to} className="text-accent" title={hash}>
        {inner}
      </Link>
    )
  }
  return (
    <span className="font-mono text-slate-800 dark:text-slate-100" title={hash}>
      {label}
    </span>
  )
}
