import { describe, expect, it } from 'vitest'
import { mapTokenListItem } from './tokens'

describe('mapTokenListItem', () => {
  it('优先 address，否则使用 address_hash（Blockscout 列表接口）', () => {
    const onlyHash = mapTokenListItem({
      address_hash: '0xabc0000000000000000000000000000000000001',
      name: 'T',
    })
    expect(onlyHash.address).toBe('0xabc0000000000000000000000000000000000001')
  })
})
