import { describe, expect, it } from 'vitest'
import { toDayjsLocale } from './time'

describe('toDayjsLocale', () => {
  it('映射 zh-CN / zh-TW', () => {
    expect(toDayjsLocale('zh-CN')).toBe('zh-cn')
    expect(toDayjsLocale('zh-TW')).toBe('zh-tw')
  })

  it('默认 en', () => {
    expect(toDayjsLocale('en')).toBe('en')
    expect(toDayjsLocale(undefined)).toBe('en')
  })
})
