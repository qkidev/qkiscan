import { apiClient, ApiError, unwrap } from './client'
import { mapSmartContract } from './mappers/contracts'
import type { ExplorerContractVM } from './view-models'

/** 已验证合约元数据与源码（Blockscout /v2/smart-contracts/:hash） */
export async function getSmartContract(address: string): Promise<ExplorerContractVM | null> {
  const encoded = encodeURIComponent(address)
  try {
    const raw = await unwrap(apiClient.get<unknown>(`/v2/smart-contracts/${encoded}`))
    return mapSmartContract(raw)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}
