import { describe, expect, it } from 'vitest'
import {
  formatNativeTransactionFee,
  formatTokenTotalSupplyDisplay,
  normalizeAmountLike,
  normalizeTokenTransferAmount,
} from './tokenAmount'

describe('normalizeAmountLike', () => {
  it('解析 { decimals, value }', () => {
    expect(normalizeAmountLike({ decimals: '18', value: '1000000000000000000' })).toBe('1')
    expect(normalizeAmountLike({ decimals: 18, value: '1000000000000000000' })).toBe('1')
  })

  it('字符串原样返回', () => {
    expect(normalizeAmountLike('123')).toBe('123')
  })
})

describe('normalizeTokenTransferAmount', () => {
  it('total 仅有 value 时用 token.decimals 换算', () => {
    const out = normalizeTokenTransferAmount(
      { value: '1000000' },
      { decimals: 6, symbol: 'USDC' },
    )
    expect(out).toBe('1')
  })

  it('total 内已有 decimals 时优先使用', () => {
    expect(
      normalizeTokenTransferAmount(
        { value: '1000000000000000000', decimals: 18 },
        { decimals: 6 },
      ),
    ).toBe('1')
  })
})

describe('formatTokenTotalSupplyDisplay', () => {
  it('按 decimals 换算 total_supply', () => {
    expect(formatTokenTotalSupplyDisplay('1000000000000000000', 18)).toBe('1')
  })
})

describe('formatNativeTransactionFee', () => {
  it('wei 字符串按 18 位换算', () => {
    expect(formatNativeTransactionFee('1000000000000000')).toBe('0.001')
  })

  it('fee 对象仅有 value 时按 wei 处理', () => {
    expect(formatNativeTransactionFee({ value: '1000000000000000000' })).toBe('1')
  })
})
