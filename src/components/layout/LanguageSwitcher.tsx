import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/constants/i18n'
import { useLanguageSwitch } from '@/hooks/useLanguage'
import clsx from 'clsx'

const LABELS: Record<AppLanguage, string> = {
  en: 'EN',
  'zh-CN': '简体',
  'zh-TW': '繁體',
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguageSwitch()

  return (
    <div className={clsx('flex items-center gap-1 rounded-md border border-border bg-surface p-0.5', className)}>
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={clsx(
            'rounded px-2 py-1 text-xs font-medium',
            language === lng ? 'bg-accent text-white' : 'text-slate-600 hover:bg-surface-muted dark:text-slate-300',
          )}
          onClick={() => setLanguage(lng)}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  )
}
