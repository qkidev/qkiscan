export const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'zh-TW'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANG_STORAGE_KEY = 'explorer-lang'
export const LANG_QUERY_KEY = 'lang'

export const DEFAULT_LANGUAGE: AppLanguage = 'en'

export function isSupportedLanguage(v: string): v is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(v)
}

export function normalizeLanguageTag(raw: string): AppLanguage {
  const t = raw.trim().replace('_', '-')
  if (t.toLowerCase() === 'zh-cn' || t === 'zh') return 'zh-CN'
  if (t.toLowerCase() === 'zh-tw' || t.toLowerCase() === 'zh-hk') return 'zh-TW'
  if (t.toLowerCase().startsWith('en')) return 'en'
  if (isSupportedLanguage(t)) return t
  return DEFAULT_LANGUAGE
}
