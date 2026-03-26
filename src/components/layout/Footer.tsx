import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation('common')
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-slate-500">
      {t('footer', { year: new Date().getFullYear() })}
    </footer>
  )
}
