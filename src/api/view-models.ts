import type { NextPageParams } from './types'

export interface PaginatedVM<T> {
  items: T[]
  nextPageParams: NextPageParams
}

export interface ExplorerBlockListItemVM {
  height: string
  hash: string
  timestampIso: string | null
  txCount: number | null
  gasUsed: string | null
  gasLimit: string | null
  minerAddress: string | null
  minerName: string | null
}

export interface ExplorerBlockDetailVM {
  height: string
  hash: string
  timestampIso: string | null
  parentHash: string | null
  txCount: number | null
  gasLimit: string | null
  gasUsed: string | null
  baseFeePerGas: string | null
  burntFees: string | null
  minerAddress: string | null
  minerName: string | null
}

export interface ExplorerTransactionListItemVM {
  hash: string
  blockNumber: string | null
  timestampIso: string | null
  from: string | null
  fromName: string | null
  to: string | null
  toName: string | null
  status: 'ok' | 'fail' | 'pending' | 'unknown'
  method: string | null
  valueWei: string | null
  fee: string | null
}

export interface ExplorerTransactionDetailVM {
  hash: string
  blockNumber: string | null
  timestampIso: string | null
  from: string | null
  fromName: string | null
  to: string | null
  toName: string | null
  status: 'ok' | 'fail' | 'pending' | 'unknown'
  nonce: number | null
  valueWei: string | null
  gasPrice: string | null
  gasUsed: string | null
  gasLimit: string | null
  maxFeePerGas: string | null
  maxPriorityFeePerGas: string | null
  fee: string | null
  input: string | null
  confirmations: number | null
}

export interface ExplorerTokenTransferVM {
  transactionHash: string | null
  /** Blockscout token transfer 的 block/交易时间 */
  timestampIso: string | null
  method: string | null
  from: string | null
  fromName: string | null
  to: string | null
  toName: string | null
  amountRaw: string | null
  tokenSymbol: string | null
  tokenAddress: string | null
  type: string | null
}

export interface ExplorerLogVM {
  address: string | null
  data: string | null
  index: number | null
  topics: string[] | null
  txHash: string | null
}

export interface ExplorerInternalTxVM {
  transactionHash: string | null
  type: string | null
  from: string | null
  fromName: string | null
  to: string | null
  toName: string | null
  value: string | null
  success: boolean | null
}

export interface ExplorerAddressVM {
  hash: string
  name: string | null
  balanceWei: string | null
  isContract: boolean
}

export interface ExplorerAddressCountersVM {
  transactionsCount: string | null
  tokenTransfersCount: string | null
  gasUsageCount: string | null
}

export interface ExplorerTokenBalanceVM {
  /** 代币合约地址 */
  token: string | null
  /** 已按 decimals 处理后的可读数量 */
  value: string | null
  tokenId: string | null
  tokenAddress: string | null
  tokenSymbol: string | null
  tokenName: string | null
  tokenDecimals: number | null
}

export interface ExplorerTokenListItemVM {
  address: string
  name: string | null
  symbol: string | null
  holders: number | null
  transfers: number | null
  totalSupply: string | null
  decimals: number | null
}

export interface ExplorerTokenDetailVM {
  address: string
  name: string | null
  symbol: string | null
  decimals: number | null
  totalSupply: string | null
  holdersCount: number | null
  transfersCount: number | null
}

export interface ExplorerStatsVM {
  totalBlocks: string | null
  totalTransactions: string | null
  totalAddresses: string | null
  averageBlockTimeSeconds: number | null
  transactionsToday: string | null
  marketCapUsd: string | null
  coinPriceUsd: string | null
  coinPriceChangePercentage: number | null
  networkUtilizationPercentage: number | null
  gasPriceSlowGwei: number | null
  gasPriceAverageGwei: number | null
  gasPriceFastGwei: number | null
}

export interface ExplorerTransactionsStatsVM {
  pendingTransactionsCount: string | null
  transactionsCount24h: string | null
  transactionFeesAvg24hWei: string | null
  transactionFeesSum24hWei: string | null
}

export interface ExplorerTransactionsChartPointVM {
  date: string
  transactionsCount: number | null
}

export interface ExplorerMarketChartPointVM {
  date: string
  closingPriceUsd: number | null
  marketCapUsd: number | null
  tvlUsd: number | null
}

export interface ExplorerContractSourceFileVM {
  filePath: string
  sourceCode: string
}

/** 由 ABI 解析出的可调用函数（供前端展示或拼 viem/ethers 的 abi 数组） */
export interface ExplorerContractAbiMethodVM {
  name: string
  signature: string
  stateMutability: string
  isRead: boolean
  inputs: { name: string; typeLabel: string }[]
  fragmentJson: string
}

/** 智能合约（/v2/smart-contracts/:hash） */
export interface ExplorerContractVM {
  name: string | null
  isVerified: boolean
  compilerVersion: string | null
  language: string | null
  /** 主文件路径（单文件验证时常见） */
  filePath: string | null
  sourceCode: string | null
  abi: string | null
  /** 从 abi 解析的 function 列表 */
  abiMethods: ExplorerContractAbiMethodVM[]
  additionalSources: ExplorerContractSourceFileVM[]
}

export interface ExplorerSearchResultVM {
  type: string
  title: string
  href: string
  subtitle: string | null
}
