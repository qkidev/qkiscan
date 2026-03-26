import { describe, expect, it } from 'vitest'
import { mapLogItem, mapTokenTransferItem, mapTxListItem } from './transactions'

describe('mapTxListItem', () => {
  it('映射基础交易字段', () => {
    const vm = mapTxListItem({
      hash: '0xabc',
      block_number: 1,
      timestamp: '2020-01-01T00:00:00Z',
      from: { hash: '0x1111111111111111111111111111111111111111' },
      to: { hash: '0x2222222222222222222222222222222222222222' },
      status: 'ok',
      value: '0',
    })
    expect(vm.hash).toBe('0xabc')
    expect(vm.from).toMatch(/^0x1111/)
    expect(vm.status).toBe('ok')
  })
})

describe('mapTokenTransferItem', () => {
  it('从 token 嵌套对象读取 symbol 与合约地址', () => {
    const vm = mapTokenTransferItem({
      transaction_hash: '0xtx',
      method: 'transfer',
      from: { hash: '0x' + '1'.repeat(40) },
      to: { hash: '0x' + '2'.repeat(40) },
      total: { value: '1000000', decimals: 6 },
      token: {
        symbol: 'USDC',
        address_hash: '0x' + 'a'.repeat(40),
      },
    })
    expect(vm.tokenSymbol).toBe('USDC')
    expect(vm.tokenAddress).toBe('0x' + 'a'.repeat(40))
    expect(vm.method).toBe('transfer')
  })

  it('method 缺失时用 type 作为展示回退', () => {
    const vm = mapTokenTransferItem({
      type: 'token_transfer',
      token: { symbol: 'TK' },
    })
    expect(vm.method).toBe('token_transfer')
  })
})

describe('mapLogItem', () => {
  it('address 为 Blockscout address 对象时解析 hash', () => {
    const vm = mapLogItem({
      index: 0,
      address: {
        hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        name: null,
        is_contract: true,
      },
      data: '0x',
    })
    expect(vm.address).toBe('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  })

  it('优先使用 address_hash 字符串', () => {
    const vm = mapLogItem({
      address_hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      address: { hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    })
    expect(vm.address).toBe('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
  })
})
