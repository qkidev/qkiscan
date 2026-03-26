import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = (import.meta.env.VITE_APP_GA_MEASUREMENT_ID ?? '').trim()

let scriptInjected = false

/** GA4：未配置衡量 ID 时不加载脚本 */
export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!MEASUREMENT_ID || scriptInjected) return
    scriptInjected = true

    window.dataLayer = window.dataLayer ?? []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return
    const path = `${location.pathname}${location.search}${location.hash}`
    window.gtag('config', MEASUREMENT_ID, { page_path: path })
  }, [location.pathname, location.search, location.hash])

  return null
}
