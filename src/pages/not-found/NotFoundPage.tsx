import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">{t('state.notFound')}</h1>
      <Link className="text-accent" to="/">
        {t('nav.home')}
      </Link>
    </div>
  )
}
