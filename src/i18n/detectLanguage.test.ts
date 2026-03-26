import { describe, expect, it, beforeEach } from 'vitest'
import { detectLanguage } from './detectLanguage'
import { LANG_QUERY_KEY, LANG_STORAGE_KEY } from '@/constants/i18n'

describe('detectLanguage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('优先使用 URL 中的 lang', () => {
    const sp = new URLSearchParams(`${LANG_QUERY_KEY}=zh-CN`)
    expect(detectLanguage(sp)).toBe('zh-CN')
  })

  it('其次使用 localStorage', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'zh-TW')
    const sp = new URLSearchParams()
    expect(detectLanguage(sp)).toBe('zh-TW')
  })

  it('URL 覆盖 localStorage', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'zh-TW')
    const sp = new URLSearchParams(`${LANG_QUERY_KEY}=en`)
    expect(detectLanguage(sp)).toBe('en')
  })
})
