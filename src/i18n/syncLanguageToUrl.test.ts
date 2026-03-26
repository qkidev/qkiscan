import { describe, expect, it } from 'vitest'
import { mergeSearchWithLang } from './syncLanguageToUrl'

describe('mergeSearchWithLang', () => {
  it('保留其它 query 并设置 lang', () => {
    const out = mergeSearchWithLang('?tab=logs&x=1', 'zh-CN')
    const sp = new URLSearchParams(out.startsWith('?') ? out.slice(1) : out)
    expect(sp.get('tab')).toBe('logs')
    expect(sp.get('x')).toBe('1')
    expect(sp.get('lang')).toBe('zh-CN')
  })
})
