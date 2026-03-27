import { Fragment, useCallback, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import {
  useChainId,
  useConnect,
  useConnectors,
  useConnection,
  useDisconnect,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import type { Abi } from 'viem'
import type { ExplorerContractAbiMethodVM } from '@/api/view-models'
import { CopyButton } from '@/components/common/CopyButton'
import type { AbiInputJson } from '@/utils/abiMethods'
import { AbiArgParseError, buildArgsFromInputs } from '@/utils/abiArgParse'
import { appChain, wagmiConfig, walletRpcConfigured } from '@/wallet/wagmiConfig'

function formatRpcResult(value: unknown): string {
  return JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2)
}

function shortenAddr(a: string): string {
  if (a.length < 12) return a
  return `${a.slice(0, 6)}...${a.slice(-4)}`
}

function InlineMethodCall({
  method,
  contractAddress,
  canInteract,
  connectionStatus,
}: {
  method: ExplorerContractAbiMethodVM
  contractAddress: string
  canInteract: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
}) {
  const { t } = useTranslation('address')
  const publicClient = usePublicClient()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const { mutateAsync: writeContract, isPending: writePending } = useWriteContract()

  const fragment = useMemo(() => {
    try {
      return JSON.parse(method.fragmentJson) as { inputs?: AbiInputJson[] }
    } catch {
      return null
    }
  }, [method.fragmentJson])
  const inputs = useMemo(() => fragment?.inputs ?? [], [fragment])
  const abi = useMemo(() => {
    try {
      return [JSON.parse(method.fragmentJson)] as Abi
    } catch {
      return null
    }
  }, [method.fragmentJson])
  const [argValues, setArgValues] = useState<string[]>(() => Array.from({ length: inputs.length }, () => ''))
  const [valueWei, setValueWei] = useState('0')
  const [result, setResult] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const isPayable = method.stateMutability === 'payable'
  const targetChainId = wagmiConfig.chains[0].id

  const readMutation = useMutation({
    mutationFn: async () => {
      if (!publicClient || !abi) throw new Error('public client unavailable')
      const args = buildArgsFromInputs(inputs, argValues)
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: method.name,
        args: args as readonly unknown[],
      })
      return data
    },
    onSuccess: (data) => {
      setErrorText(null)
      setResult(formatRpcResult(data))
    },
    onError: (err: unknown) => {
      setResult(null)
      setErrorText(err instanceof Error ? err.message : String(err))
    },
  })

  const { isPending: txConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  const onRead = useCallback(() => {
    setErrorText(null)
    try {
      buildArgsFromInputs(inputs, argValues)
    } catch (e) {
      setErrorText(e instanceof AbiArgParseError ? e.message : String(e))
      return
    }
    void readMutation.mutateAsync()
  }, [argValues, inputs, readMutation])

  const onWrite = useCallback(async () => {
    if (!abi) return
    setErrorText(null)
    let args: unknown[]
    try {
      args = buildArgsFromInputs(inputs, argValues)
    } catch (e) {
      setErrorText(e instanceof AbiArgParseError ? e.message : String(e))
      return
    }
    let value: bigint | undefined
    try {
      value = isPayable ? BigInt(valueWei.trim() || '0') : undefined
    } catch {
      setErrorText(t('contractInteract.invalidValueWei'))
      return
    }
    try {
      if (chainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId })
      }
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: method.name,
        args: args as readonly unknown[],
        value,
        chainId: targetChainId,
      })
      setTxHash(hash)
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : String(e))
    }
  }, [abi, argValues, chainId, contractAddress, inputs, isPayable, method.name, switchChainAsync, t, targetChainId, valueWei, writeContract])

  if (!canInteract || !abi) return null

  return (
    <div className="space-y-2 rounded border border-border bg-surface-muted p-3">
      <div className="text-xs text-slate-500">{t('contractInteract.rpcHint', { chain: appChain.name, id: targetChainId })}</div>
      {!walletRpcConfigured ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">{t('contractInteract.rpcMissing')}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {inputs.map((inp, i) => (
          <label key={`${method.signature}-${i}`} className="block">
            <span className="mb-1 block font-mono text-xs text-slate-600 dark:text-slate-300">
              {inp.name || `arg${i}`} ({inp.type ?? method.inputs[i]?.typeLabel ?? ''})
            </span>
            <input
              className="w-full rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs"
              value={argValues[i] ?? ''}
              placeholder={(inp.type ?? '').startsWith('tuple') ? t('contractInteract.placeholderTuple') : undefined}
              onChange={(e) => {
                const next = [...argValues]
                next[i] = e.target.value
                setArgValues(next)
              }}
            />
          </label>
        ))}
      </div>
      {isPayable ? (
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-slate-500">{t('contractInteract.valueWei')}</span>
          <input
            className="w-full rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs"
            value={valueWei}
            onChange={(e) => setValueWei(e.target.value)}
          />
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {method.isRead ? (
          <button
            type="button"
            className="rounded bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50"
            disabled={readMutation.isPending}
            onClick={() => void onRead()}
          >
            {readMutation.isPending ? t('common:state.loading') : t('contractInteract.callRead')}
          </button>
        ) : (
          <button
            type="button"
            className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            disabled={writePending || connectionStatus !== 'connected'}
            onClick={() => void onWrite()}
          >
            {writePending ? t('common:state.loading') : t('contractInteract.callWrite')}
          </button>
        )}
      </div>
      {!method.isRead && connectionStatus !== 'connected' ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">{t('contractInteract.walletRequired')}</p>
      ) : null}
      {errorText ? <p className="text-xs text-red-600 dark:text-red-400">{errorText}</p> : null}
      {result ? (
        <pre className="max-h-40 overflow-auto rounded border border-border bg-slate-950 p-2 text-xs text-slate-100">{result}</pre>
      ) : null}
      {txHash ? (
        <div className="font-mono text-xs">
          <span className="text-slate-500">{t('contractInteract.txHash')}: </span>
          <span className="break-all">{txHash}</span>
          {txConfirming ? <span className="ml-2 text-slate-500">{t('contractInteract.txPending')}</span> : null}
          {txSuccess ? <span className="ml-2 text-green-600">{t('contractInteract.txSuccess')}</span> : null}
        </div>
      ) : null}
    </div>
  )
}

export function ContractAbiMethods({
  methods,
  contractAddress,
  canInteract,
}: {
  methods: ExplorerContractAbiMethodVM[]
  contractAddress?: string
  canInteract?: boolean
}) {
  const { t } = useTranslation('address')
  const connection = useConnection()
  const connectors = useConnectors()
  const { connectAsync, isPending: connectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const targetChainId = wagmiConfig.chains[0].id
  if (methods.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <h3 className="text-sm font-medium">{t('contractAbiMethods')}</h3>
        {canInteract ? (
          <div className="flex items-center gap-2">
            {connection.status === 'connected' && connection.address ? (
              <>
                <span className="font-mono text-xs text-slate-500">{shortenAddr(connection.address)}</span>
                <button
                  type="button"
                  className="rounded border border-border bg-surface-muted px-2 py-1 text-xs"
                  onClick={() => void disconnect()}
                >
                  {t('contractInteract.disconnect')}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rounded bg-accent px-2 py-1 text-xs text-white disabled:opacity-50"
                disabled={!connectors[0] || connectPending}
                onClick={() => void connectAsync({ connector: connectors[0], chainId: targetChainId })}
              >
                {connectPending ? t('common:state.loading') : t('contractInteract.connectWallet')}
              </button>
            )}
          </div>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">{t('contractAbiMethodKind')}</th>
              <th className="px-3 py-2">{t('contractAbiSignature')}</th>
              <th className="px-3 py-2">{t('contractAbiParams')}</th>
              <th className="px-3 py-2">{t('contractAbiStateMutability')}</th>
              <th className="px-3 py-2">{t('contractAbiFragment')}</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m, i) => (
              <Fragment key={`${m.signature}-${i}`}>
                <tr key={`${m.signature}-${i}`} className="border-b border-border">
                  <td className="px-3 py-2 align-top">
                    <span
                      className={clsx(
                        'inline-block rounded px-2 py-0.5 text-xs font-medium',
                        m.isRead
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
                          : 'bg-amber-500/15 text-amber-900 dark:text-amber-100',
                      )}
                    >
                      {m.isRead ? t('contractAbiMethodRead') : t('contractAbiMethodWrite')}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-xs text-slate-800 dark:text-slate-100">{m.signature}</td>
                  <td className="max-w-md px-3 py-2 align-top font-mono text-xs text-slate-600 dark:text-slate-300">
                    {m.inputs.length === 0 ? '—' : m.inputs.map((x) => `${x.name}: ${x.typeLabel}`).join(', ')}
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-xs">{m.stateMutability}</td>
                  <td className="px-3 py-2 align-top">
                    <CopyButton text={m.fragmentJson} />
                  </td>
                </tr>
                {canInteract && contractAddress ? (
                  <tr key={`${m.signature}-${i}-interact`} className="border-b border-border last:border-0">
                    <td className="px-3 pb-3" colSpan={5}>
                      <InlineMethodCall
                        method={m}
                        contractAddress={contractAddress}
                        canInteract={canInteract}
                        connectionStatus={connection.status}
                      />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-slate-500">{t('contractAbiMethodsHint')}</p>
    </div>
  )
}
