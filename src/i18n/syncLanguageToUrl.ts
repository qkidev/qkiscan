import { LANG_QUERY_KEY, type AppLanguage } from '@/constants/i18n'

/** 保留 pathname 与其它 query，更新或设置 lang */
export function mergeSearchWithLang(search: string, lang: AppLanguage): string {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  params.set(LANG_QUERY_KEY, lang)
  const s = params.toString()
  return s ? `?${s}` : ''
}
