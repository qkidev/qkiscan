import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStatsCounters } from '@/api/stats'
import { getMainPageBlocks } from '@/api/blocks'
import { getMainPageTransactions } from '@/api/transactions'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { HashText } from '@/components/common/HashText'
import { Timestamp } from '@/components/common/Timestamp'
import { AddressLink } from '@/components/common/AddressLink'

export function HomePage() {
  const { t } = useTranslation(['home', 'common'])

  const query = useQuery({
    queryKey: ['home', 'overview'],
    queryFn: async () => {
      const stats = await getStatsCounters()
      const blocks = await getMainPageBlocks()
      const txs = await getMainPageTransactions()
      return { stats, blocks, txs }
    },
    staleTime: 25_000,
  })

  if (query.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }
  const { stats, blocks, txs } = query.data
  const empty = blocks.length === 0 && txs.length === 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('home:title')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{t('home:subtitle')}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t('home:stats.totalBlocks')}
          value={stats.totalBlocks ?? '—'}
          to="/blocks"
          ariaLabel={t('home:stats.goBlocks')}
        />
        <StatCard
          label={t('home:stats.totalTxs')}
          value={stats.totalTransactions ?? '—'}
          to="/txs"
          ariaLabel={t('home:stats.goTxs')}
        />
        <StatCard
          label={t('home:stats.totalAddresses')}
          value={stats.totalAddresses ?? '—'}
          to="/search"
          ariaLabel={t('home:stats.goAddresses')}
        />
      </section>

      {empty ? (
        <EmptyState title={t('common:state.empty')} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium">{t('home:latestBlocks')}</h2>
              <Link className="text-sm text-accent" to="/blocks">
                {t('home:viewAll')}
              </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{t('common:table.block')}</th>
                    <th className="px-3 py-2">{t('common:table.hash')}</th>
                    <th className="px-3 py-2">{t('common:table.time')}</th>
                    <th className="hidden px-3 py-2 sm:table-cell">{t('common:table.miner')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b) => (
                    <tr key={`${b.height}-${b.hash}`} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-mono">
                        <Link className="text-accent" to={`/blocks/${b.height}`}>
                          {b.height}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        <HashText hash={b.hash} to={`/blocks/${b.hash}`} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Timestamp iso={b.timestampIso} />
                      </td>
                      <td className="hidden px-3 py-2 sm:table-cell">
                        <AddressLink address={b.minerAddress} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium">{t('home:latestTxs')}</h2>
              <Link className="text-sm text-accent" to="/txs">
                {t('home:viewAll')}
              </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{t('common:table.tx')}</th>
                    <th className="px-3 py-2">{t('common:table.time')}</th>
                    <th className="hidden px-3 py-2 md:table-cell">{t('common:table.from')}</th>
                    <th className="hidden px-3 py-2 lg:table-cell">{t('common:table.to')}</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => (
                    <tr key={tx.hash} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <HashText hash={tx.hash} to={`/tx/${tx.hash}`} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Timestamp iso={tx.timestampIso} />
                      </td>
                      <td className="hidden px-3 py-2 md:table-cell">
                        <AddressLink address={tx.from} />
                      </td>
                      <td className="hidden px-3 py-2 lg:table-cell">
                        <AddressLink address={tx.to} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  to,
  ariaLabel,
}: {
  label: string
  value: string
  to: string
  ariaLabel: string
}) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className="block rounded-lg border border-border bg-surface p-4 shadow-sm no-underline transition hover:border-accent hover:shadow-md hover:no-underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
    </Link>
  )
}
