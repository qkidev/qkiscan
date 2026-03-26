import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

/** 将 i18n 语言（en / zh-CN / zh-TW）映射为 dayjs 已注册的 locale 名 */
export function toDayjsLocale(i18nLang: string | undefined): string {
  if (!i18nLang) return 'en'
  const n = i18nLang.replace('_', '-')
  if (n === 'zh-CN' || n.toLowerCase() === 'zh-cn') return 'zh-cn'
  if (n === 'zh-TW' || n.toLowerCase() === 'zh-tw' || n.toLowerCase() === 'zh-hk') return 'zh-tw'
  return 'en'
}

export function formatAbsolute(iso: string | null | undefined, i18nLang?: string): string {
  if (!iso) return '—'
  const d = dayjs(iso)
  if (!d.isValid()) return '—'
  const loc = toDayjsLocale(i18nLang)
  return d.locale(loc).format('LL LTS')
}

export function formatRelative(iso: string | null | undefined, i18nLang?: string): string {
  if (!iso) return '—'
  const d = dayjs(iso)
  if (!d.isValid()) return '—'
  const loc = toDayjsLocale(i18nLang)
  return d.locale(loc).fromNow()
}
