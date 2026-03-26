import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchNavigate } from '@/hooks/useSearchNavigate'

export function SearchBar({ className }: { className?: string }) {
  const { t } = useTranslation('common')
  const navigate = useSearchNavigate()
  const [value, setValue] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    navigate(value)
    setValue('')
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="w-full min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
          placeholder={t('search.placeholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={t('search.placeholder')}
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t('search.submit')}
        </button>
      </div>
    </form>
  )
}
