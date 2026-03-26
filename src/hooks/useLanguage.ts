import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '@/constants/i18n'
import { LANG_QUERY_KEY, isSupportedLanguage } from '@/constants/i18n'
import { detectLanguage, persistLanguageChoice } from '@/i18n/detectLanguage'
import { mergeSearchWithLang } from '@/i18n/syncLanguageToUrl'

export function useLanguageSync(): void {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const lng = detectLanguage(params)
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng)
    }
  }, [location.search, i18n])
}

export function useLanguageSwitch() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const language = useMemo(() => {
    const lng = i18n.language
    return (isSupportedLanguage(lng) ? lng : 'en') as AppLanguage
  }, [i18n.language])

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      persistLanguageChoice(lang)
      void i18n.changeLanguage(lang)
      const search = mergeSearchWithLang(location.search, lang)
      navigate({ pathname: location.pathname, search }, { replace: true })
    },
    [i18n, navigate, location.pathname, location.search],
  )

  return { language, setLanguage, langQueryKey: LANG_QUERY_KEY }
}
