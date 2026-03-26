import { useTranslation } from 'react-i18next'
import { formatAbsolute, formatRelative } from '@/utils/time'

export function Timestamp({ iso }: { iso: string | null | undefined }) {
  const { i18n } = useTranslation()
  if (!iso) return <span className="text-slate-400">—</span>
  /** 语言切换后相对/绝对时间随当前界面语言更新 */
  const lang = i18n.language
  return (
    <span title={formatAbsolute(iso, lang)} className="whitespace-nowrap">
      {formatRelative(iso, lang)}
    </span>
  )
}
