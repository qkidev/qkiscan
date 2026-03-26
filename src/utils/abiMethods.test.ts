import { describe, expect, it } from 'vitest'
import { buildFunctionSignature, formatAbiInputType, mapAbiToCallableMethods } from './abiMethods'

describe('mapAbiToCallableMethods', () => {
  it('parses ERC-20 style functions', () => {
    const abi = [
      {
        type: 'function',
        name: 'transfer',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
      },
    ]
    const methods = mapAbiToCallableMethods(abi)
    expect(methods).toHaveLength(2)
    const transfer = methods.find((m) => m.name === 'transfer')
    expect(transfer?.signature).toBe('transfer(address,uint256)')
    expect(transfer?.isRead).toBe(false)
    const balance = methods.find((m) => m.name === 'balanceOf')
    expect(balance?.signature).toBe('balanceOf(address)')
    expect(balance?.isRead).toBe(true)
    expect(JSON.parse(transfer!.fragmentJson).name).toBe('transfer')
  })

  it('ignores events and constructors', () => {
    const abi = [
      { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
      { type: 'event', name: 'Transfer', inputs: [], anonymous: false },
      { type: 'function', name: 'foo', inputs: [], outputs: [], stateMutability: 'pure' },
    ]
    const methods = mapAbiToCallableMethods(abi)
    expect(methods).toHaveLength(1)
    expect(methods[0].name).toBe('foo')
  })

  it('accepts ABI JSON string', () => {
    const json = JSON.stringify([
      {
        type: 'function',
        name: 'approve',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable',
      },
    ])
    const methods = mapAbiToCallableMethods(json)
    expect(methods[0]?.signature).toBe('approve(address,uint256)')
  })
})

describe('formatAbiInputType', () => {
  it('expands tuple', () => {
    expect(
      formatAbiInputType({
        type: 'tuple',
        components: [
          { name: 'x', type: 'uint256' },
          { name: 'y', type: 'bool' },
        ],
      }),
    ).toBe('(uint256,bool)')
  })
})

describe('buildFunctionSignature', () => {
  it('builds signature', () => {
    expect(
      buildFunctionSignature('foo', [
        { type: 'address', name: 'a' },
        { type: 'uint256', name: 'b' },
      ]),
    ).toBe('foo(address,uint256)')
  })
})
