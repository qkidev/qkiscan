import { describe, expect, it } from 'vitest'
import { asItemArray } from './responseNormalize'

describe('asItemArray', () => {
  it('接受顶层数组', () => {
    expect(asItemArray([{ a: 1 }, { a: 2 }])).toEqual([{ a: 1 }, { a: 2 }])
  })

  it('接受 { items } 包装', () => {
    expect(asItemArray({ items: [{ a: 1 }] })).toEqual([{ a: 1 }])
  })

  it('空值', () => {
    expect(asItemArray(undefined)).toEqual([])
  })
})
