/**
 * 将 Solidity ABI JSON 解析为可供前端展示与拼接调用的 function 列表（不含 constructor/event/error）。
 */

import type { ExplorerContractAbiMethodVM } from '@/api/view-models'

export interface AbiInputJson {
  name?: string
  type?: string
  internalType?: string
  components?: AbiInputJson[]
}

export interface AbiItemJson {
  type?: string
  name?: string
  stateMutability?: string
  inputs?: AbiInputJson[]
  outputs?: AbiInputJson[]
}

export function parseAbiArray(raw: unknown): AbiItemJson[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as AbiItemJson[]
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown
      return Array.isArray(parsed) ? (parsed as AbiItemJson[]) : []
    } catch {
      return []
    }
  }
  return []
}

/** 生成与 Solidity 接口一致的参数类型串（含 tuple 展开） */
export function formatAbiInputType(input: AbiInputJson): string {
  const t = input.type ?? ''
  if (t === 'tuple') {
    const inner = (input.components ?? []).map(formatAbiInputType).join(',')
    return `(${inner})`
  }
  if (t.startsWith('tuple[')) {
    const inner = input.components?.length
      ? `(${input.components.map(formatAbiInputType).join(',')})`
      : ''
    return inner + t.slice('tuple'.length)
  }
  return t
}

export function buildFunctionSignature(name: string, inputs: AbiInputJson[] | undefined): string {
  const params = (inputs ?? []).map(formatAbiInputType).join(',')
  return `${name}(${params})`
}

export function mapAbiToCallableMethods(abi: unknown): ExplorerContractAbiMethodVM[] {
  const items = parseAbiArray(abi)
  const out: ExplorerContractAbiMethodVM[] = []
  for (const item of items) {
    if (item.type !== 'function') continue
    const name = item.name?.trim()
    if (!name) continue
    const inputs = item.inputs ?? []
    const signature = buildFunctionSignature(name, inputs)
    const stateMutability = item.stateMutability ?? 'nonpayable'
    const isRead = stateMutability === 'view' || stateMutability === 'pure'
    out.push({
      name,
      signature,
      stateMutability,
      isRead,
      inputs: inputs.map((inp, i) => ({
        name: inp.name?.trim() || `arg${i}`,
        typeLabel: formatAbiInputType(inp),
      })),
      fragmentJson: JSON.stringify(item),
    })
  }
  out.sort((a, b) => a.name.localeCompare(b.name) || a.signature.localeCompare(b.signature))
  return out
}
