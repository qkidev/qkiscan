import { describe, expect, it } from 'vitest'
import { toAverageBlockTimeSec } from './stats'

describe('toAverageBlockTimeSec', () => {
  it('把 Blockscout 返回的毫秒换算成秒', () => {
    expect(toAverageBlockTimeSec(16_586)).toBeCloseTo(16.586)
    expect(toAverageBlockTimeSec('16586')).toBeCloseTo(16.586)
  })

  it('空值与非法值返回 null', () => {
    expect(toAverageBlockTimeSec(null)).toBeNull()
    expect(toAverageBlockTimeSec(undefined)).toBeNull()
    expect(toAverageBlockTimeSec('abc')).toBeNull()
  })
})
