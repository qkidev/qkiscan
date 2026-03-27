import { isAddress, isHex } from 'viem'
import type { AbiInputJson } from '@/utils/abiMethods'

export class AbiArgParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AbiArgParseError'
  }
}

function valueToRaw(v: unknown): string {
  if (typeof v === 'bigint') return v.toString()
  if (typeof v === 'object' && v !== null) return JSON.stringify(v)
  return String(v)
}

function parseLeaf(type: string, raw: string): unknown {
  const t = type.trim()
  const s = raw.trim()

  if (t === 'address') {
    if (!isAddress(s)) throw new AbiArgParseError(`无效地址: ${s}`)
    return s
  }

  if (t === 'bool') {
    const low = s.toLowerCase()
    if (low === 'true' || low === '1') return true
    if (low === 'false' || low === '0') return false
    throw new AbiArgParseError(`无效布尔值: ${s}`)
  }

  if (t === 'string') {
    return raw
  }

  if (t.startsWith('uint') || t.startsWith('int')) {
    try {
      return BigInt(s)
    } catch {
      throw new AbiArgParseError(`无效整数 (${t}): ${s}`)
    }
  }

  if (t === 'bytes') {
    if (!isHex(s)) throw new AbiArgParseError(`无效 bytes（需 0x 十六进制）: ${s}`)
    return s
  }

  if (t.startsWith('bytes') && t !== 'bytes') {
    if (!isHex(s)) throw new AbiArgParseError(`无效 ${t}: ${s}`)
    return s
  }

  throw new AbiArgParseError(`暂不支持的参数类型: ${t}`)
}

/**
 * 将单行输入解析为 viem 合约调用所需的参数值（支持 tuple、数组与常见标量）。
 */
export function parseAbiInput(input: AbiInputJson, raw: string): unknown {
  const type = (input.type ?? '').trim()
  if (!type) throw new AbiArgParseError('缺少参数类型')

  if (type === 'tuple') {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw.trim())
    } catch {
      throw new AbiArgParseError('tuple 请输入合法 JSON 数组（按字段顺序）')
    }
    const comps = input.components ?? []
    if (!Array.isArray(parsed)) throw new AbiArgParseError('tuple 必须是 JSON 数组')
    if (parsed.length !== comps.length) {
      throw new AbiArgParseError(`tuple 需要 ${comps.length} 个元素，实际 ${parsed.length} 个`)
    }
    return comps.map((c, i) => parseAbiInput(c, valueToRaw(parsed[i])))
  }

  if (type === 'tuple[]') {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw.trim())
    } catch {
      throw new AbiArgParseError('tuple[] 请输入合法 JSON 数组')
    }
    if (!Array.isArray(parsed)) throw new AbiArgParseError('tuple[] 必须是 JSON 数组')
    const comps = input.components ?? []
    return parsed.map((el) => parseAbiInput({ type: 'tuple', components: comps }, valueToRaw(el)))
  }

  if (type.endsWith('[]')) {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw.trim())
    } catch {
      throw new AbiArgParseError('数组类型请输入合法 JSON 数组')
    }
    if (!Array.isArray(parsed)) throw new AbiArgParseError('数组类型必须是 JSON 数组')
    const inner = type.slice(0, -2).trim()
    return parsed.map((el) => parseAbiInput({ type: inner }, valueToRaw(el)))
  }

  return parseLeaf(type, raw)
}

export function buildArgsFromInputs(inputs: AbiInputJson[], rawValues: string[]): unknown[] {
  if (inputs.length !== rawValues.length) {
    throw new AbiArgParseError(`参数个数不匹配：需要 ${inputs.length} 个`)
  }
  return inputs.map((inp, i) => parseAbiInput(inp, rawValues[i] ?? ''))
}
