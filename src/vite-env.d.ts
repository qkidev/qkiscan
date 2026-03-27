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
  /** 钱包 / 合约调用：链 ID（与 Blockscout 所连链一致） */
  readonly VITE_APP_WALLET_CHAIN_ID?: string
  /** 钱包 / 合约调用：JSON-RPC URL（与链 ID 成对配置；不填则默认以太坊主网公共 RPC） */
  readonly VITE_APP_WALLET_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
