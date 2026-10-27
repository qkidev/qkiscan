import { useTranslation } from 'react-i18next'
import { formatAbsolute, formatRelative } from '@/utils/time'

type TimestampFormat = 'relative' | 'absolute'

export function Timestamp({
  iso,
  format = 'relative',
}: {
  iso: string | null | undefined
  /** relative：列表用相对时间；absolute：详情页用完整时间 */
  format?: TimestampFormat
}) {
  const { i18n } = useTranslation()
  if (!iso) return <span className="text-slate-400">—</span>
  const lang = i18n.language
  const absolute = formatAbsolute(iso, lang)
  const relative = formatRelative(iso, lang)
  const display = format === 'absolute' ? absolute : relative
  const title = format === 'absolute' ? relative : absolute
  return (
    <span title={title} className="whitespace-nowrap">
      {display}
    </span>
  )
}
