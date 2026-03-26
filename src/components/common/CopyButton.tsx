import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { t } = useTranslation('common')
  const [done, setDone] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className={clsx(
        'rounded border border-border px-2 py-0.5 text-xs text-slate-600 hover:bg-surface-muted dark:text-slate-300',
        className,
      )}
      onClick={onCopy}
    >
      {done ? t('copied') : t('copy')}
    </button>
  )
}
