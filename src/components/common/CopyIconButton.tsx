import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

/** 仅图标的复制按钮，用于地址、哈希等旁侧 */
export function CopyIconButton({ text, className }: { text: string; className?: string }) {
  const { t } = useTranslation('common')
  const [done, setDone] = useState(false)

  async function onCopy(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
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
      aria-label={done ? t('copied') : t('copy')}
      title={done ? t('copied') : t('copy')}
      className={clsx(
        'inline-flex shrink-0 rounded p-0.5 text-slate-500 hover:bg-surface-muted hover:text-accent dark:text-slate-400',
        className,
      )}
      onClick={onCopy}
    >
      {done ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  )
}
