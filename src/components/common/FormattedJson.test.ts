import { describe, expect, it } from 'vitest'
import { normalizeJsonValue } from '@/utils/normalizeJsonValue'

describe('normalizeJsonValue', () => {
  it('解析 JSON 字符串', () => {
    expect(normalizeJsonValue('{"a":1}')).toEqual({ a: 1 })
  })

  it('双重 JSON 字符串', () => {
    const inner = JSON.stringify({ b: 2 })
    const double = JSON.stringify(inner)
    expect(normalizeJsonValue(double)).toEqual({ b: 2 })
  })

  it('已是对象则原样返回', () => {
    const o = { x: [1, 2] }
    expect(normalizeJsonValue(o)).toBe(o)
  })
})
