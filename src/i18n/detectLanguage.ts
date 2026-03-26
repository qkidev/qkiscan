import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANG_QUERY_KEY,
  LANG_STORAGE_KEY,
  normalizeLanguageTag,
  type AppLanguage,
} from '@/constants/i18n'

function defaultFromEnv(): AppLanguage {
  const raw = import.meta.env.VITE_APP_DEFAULT_LANG
  if (typeof raw === 'string' && raw.length > 0) return normalizeLanguageTag(raw)
  return DEFAULT_LANGUAGE
}

/** 优先级：URL lang > localStorage > navigator > 默认 */
export function detectLanguage(searchParams: URLSearchParams): AppLanguage {
  const fromUrl = searchParams.get(LANG_QUERY_KEY)
  if (fromUrl) {
    const n = normalizeLanguageTag(fromUrl)
    if (isSupportedLanguage(n)) return n
  }
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored) {
      const n = normalizeLanguageTag(stored)
      if (isSupportedLanguage(n)) return n
    }
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return normalizeLanguageTag(navigator.language)
  }
  return defaultFromEnv()
}

export function persistLanguageChoice(lang: AppLanguage): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
}
