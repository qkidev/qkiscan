import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { search } from '@/api/search'
import { Loading } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'

export function SearchPage() {
  const { t } = useTranslation(['search', 'common'])
  const [searchParams] = useSearchParams()
  const q = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams])

  const query = useQuery({
    queryKey: ['search', q],
    queryFn: () => search(q),
    enabled: q.length > 0,
  })

  if (!q) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('search:title')}</h1>
        <EmptyState title={t('search:noQuery')} />
      </div>
    )
  }

  if (query.isPending) {
    return <Loading label={t('common:state.loading')} />
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }

  const items = query.data
  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('search:title')}</h1>
        <p className="text-sm text-slate-600">{t('search:hint')}</p>
        <EmptyState title={t('common:state.empty')} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('search:title')}</h1>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {items.map((item) => (
          <li key={`${item.type}-${item.href}-${item.title}`} className="px-4 py-3">
            <div className="text-xs uppercase text-slate-500">{item.type}</div>
            <Link className="mt-1 block font-medium text-accent" to={item.href}>
              {item.title}
            </Link>
            {item.subtitle ? <div className="text-sm text-slate-600">{item.subtitle}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
