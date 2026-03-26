/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CHAIN_NAME: string
  readonly VITE_APP_DEFAULT_LANG: string
  readonly VITE_APP_ENABLE_THEME: string
  readonly VITE_APP_ENABLE_PRICE: string
  readonly VITE_APP_API_BASE: string
  readonly VITE_APP_NATIVE_SYMBOL: string
  readonly VITE_DEV_BLOCKSCOUT_ORIGIN: string
  /** GA4 衡量 ID，未在 .env 中定义时构建产物中为空字符串 */
  readonly VITE_APP_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
