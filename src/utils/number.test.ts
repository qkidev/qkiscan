import { describe, expect, it } from 'vitest'
import { formatThousandsTrim, formatWeiToDecimal, formatWeiToGwei } from './number'

describe('formatThousandsTrim', () => {
  it('整数不加千分位分隔符', () => {
    expect(formatThousandsTrim('1234567')).toBe('1234567')
  })
})

describe('formatWeiToDecimal', () => {
  it('格式化 wei 为十进制字符串', () => {
    const s = formatWeiToDecimal('1000000000000000000', 18)
    expect(s).toBe('1')
  })
})

describe('formatWeiToGwei', () => {
  it('将 wei 转为 gwei 并带单位', () => {
    expect(formatWeiToGwei('1000000000')).toMatch(/^1 gwei$/)
    expect(formatWeiToGwei('15000000000')).toContain('15')
    expect(formatWeiToGwei(null)).toBe('—')
  })
})
