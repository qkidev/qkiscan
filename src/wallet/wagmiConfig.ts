import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import type { Chain } from 'viem'

const rawId = import.meta.env.VITE_APP_WALLET_CHAIN_ID
const rpcUrl = import.meta.env.VITE_APP_WALLET_RPC_URL?.trim()
const chainName = import.meta.env.VITE_APP_CHAIN_NAME?.trim() || 'Ethereum'
const nativeSymbol = import.meta.env.VITE_APP_NATIVE_SYMBOL?.trim() || 'ETH'

const idNum = rawId != null && rawId !== '' ? Number(rawId) : NaN

/** 仅当配置了 VITE_APP_WALLET_CHAIN_ID（有效数字）时使用自定义链；不再要求必须同时填 RPC。未填 RPC 时无法读链/发交易，但名称与 chainId 会正确显示。 */
const useCustomChain = Number.isFinite(idNum) && idNum > 0 && Number.isInteger(idNum)

const chain: Chain = useCustomChain
  ? {
      id: idNum,
      name: chainName,
      nativeCurrency: {
        name: nativeSymbol,
        symbol: nativeSymbol,
        decimals: 18,
      },
      rpcUrls: {
        default: { http: rpcUrl ? [rpcUrl] : [] },
      },
    }
  : mainnet

export const appChain = chain

/** 是否已配置钱包 RPC（用于 JSON-RPC 读合约等）；未配置时仅链元数据正确，调用会失败。 */
export const walletRpcConfigured = Boolean(rpcUrl)

export const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [chain.id]: http(rpcUrl ? rpcUrl : undefined),
  },
})
