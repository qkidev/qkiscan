import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { AbiArgParseError, buildArgsFromInputs } from '@/utils/abiArgParse'
import type { AbiInputJson } from '@/utils/abiMethods'
import { appChain, wagmiConfig } from '@/wallet/wagmiConfig'

function formatRpcResult(value: unknown): string {
  return JSON.stringify(
    value,
    (_, v) => (typeof v === 'bigint' ? v.toString() : v),
    2,
  )
}

function shortenAddr(a: string): string {
  if (a.length < 12) return a
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

type InteractMethodBodyProps = {
  contractAddress: string
  selectedMethod: ExplorerContractAbiMethodVM
  abi: Abi
  inputs: AbiInputJson[]
  isRead: boolean
  isPayable: boolean
  publicClient: ReturnType<typeof usePublicClient>
  connection: ReturnType<typeof useConnection>
  chainId: number | undefined
  targetChainId: number
  sendContractTx: ReturnType<typeof useWriteContract>['mutateAsync']
  writePending: boolean
  writeError: ReturnType<typeof useWriteContract>['error']
  switchChainAsync: (args: { chainId: number }) => Promise<unknown>
}

function InteractMethodBody({
  contractAddress,
  selectedMethod,
  abi,
  inputs,
  isRead,
  isPayable,
  publicClient,
  connection,
  chainId,
  targetChainId,
  sendContractTx,
  writePending,
  writeError,
  switchChainAsync,
}: InteractMethodBodyProps) {
  const { t } = useTranslation('address')
  const [argValues, setArgValues] = useState<string[]>(() => Array.from({ length: inputs.length }, () => ''))
  const [valueWei, setValueWei] = useState('0')
  const [readResult, setReadResult] = useState<string | null>(null)
  const [readError, setReadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const readMutation = useMutation({
    mutationFn: async () => {
      if (!publicClient) throw new Error('client')
      const args = buildArgsFromInputs(inputs, argValues)
      const result = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: selectedMethod.name,
        args: args as readonly unknown[],
      })
      return result
    },
    onSuccess: (data) => {
      setReadError(null)
      setReadResult(formatRpcResult(data))
    },
    onError: (err: unknown) => {
      setReadResult(null)
      setReadError(err instanceof Error ? err.message : String(err))
    },
  })

  const { isPending: txConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  })

  const ensureChain = useCallback(async () => {
    if (chainId === targetChainId) return
    await switchChainAsync({ chainId: targetChainId })
  }, [chainId, switchChainAsync, targetChainId])

  const onRead = useCallback(() => {
    setActionError(null)
    try {
      buildArgsFromInputs(inputs, argValues)
    } catch (e) {
      setActionError(e instanceof AbiArgParseError ? e.message : String(e))
      return
    }
    void readMutation.mutateAsync()
  }, [argValues, inputs, readMutation])

  const onWrite = useCallback(async () => {
    if (!connection.address) {
      setActionError(t('contractInteract.walletRequired'))
      return
    }
    setActionError(null)
    let args: unknown[]
    try {
      args = buildArgsFromInputs(inputs, argValues)
    } catch (e) {
      setActionError(e instanceof AbiArgParseError ? e.message : String(e))
      return
    }
    let value: bigint | undefined
    try {
      value = isPayable ? BigInt(valueWei.trim() || '0') : undefined
    } catch {
      setActionError(t('contractInteract.invalidValueWei'))
      return
    }
    try {
      await ensureChain()
      const hash = await sendContractTx({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: selectedMethod.name,
        args: args as readonly unknown[],
        value,
        chainId: targetChainId,
      })
      setTxHash(hash)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e))
    }
  }, [
    abi,
    argValues,
    connection.address,
    contractAddress,
    ensureChain,
    inputs,
    isPayable,
    selectedMethod.name,
    sendContractTx,
    targetChainId,
    valueWei,
    t,
  ])

  return (
    <div className="space-y-3">
      {inputs.map((inp, i) => (
        <label key={`${inp.name}-${i}`} className="block">
          <span className="mb-1 block font-mono text-xs text-slate-600 dark:text-slate-400">
            {inp.name || `arg${i}`}{' '}
            <span className="text-slate-400">
              ({inp.type ?? selectedMethod.inputs[i]?.typeLabel ?? ''})
            </span>
          </span>
          <input
            className="w-full rounded border border-border bg-surface-muted px-2 py-2 font-mono text-xs"
            placeholder={
              (inp.type ?? '').startsWith('tuple') ? t('contractInteract.placeholderTuple') : undefined
            }
            value={argValues[i] ?? ''}
            onChange={(e) => {
              const next = [...argValues]
              next[i] = e.target.value
              setArgValues(next)
            }}
          />
        </label>
      ))}

      {isPayable ? (
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-slate-500">{t('contractInteract.valueWei')}</span>
          <input
            className="w-full rounded border border-border bg-surface-muted px-2 py-2 font-mono text-xs"
            value={valueWei}
            onChange={(e) => setValueWei(e.target.value)}
          />
        </label>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {isRead ? (
          <button
            type="button"
            className="rounded bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50 dark:bg-slate-600"
            disabled={readMutation.isPending}
            onClick={() => void onRead()}
          >
            {readMutation.isPending ? t('common:state.loading') : t('contractInteract.callRead')}
          </button>
        ) : (
          <button
            type="button"
            className="rounded bg-accent px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            disabled={writePending || connection.status !== 'connected'}
            onClick={() => void onWrite()}
          >
            {writePending ? t('common:state.loading') : t('contractInteract.callWrite')}
          </button>
        )}
      </div>

      {connection.status !== 'connected' && !isRead ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">{t('contractInteract.walletRequired')}</p>
      ) : null}

      {actionError ? <p className="text-xs text-red-600 dark:text-red-400">{actionError}</p> : null}
      {readError ? <p className="text-xs text-red-600 dark:text-red-400">{readError}</p> : null}
      {readResult ? (
        <div>
          <div className="mb-1 text-xs uppercase text-slate-500">{t('contractInteract.result')}</div>
          <pre className="max-h-48 overflow-auto rounded border border-border bg-slate-950 p-3 text-xs text-slate-100">
            {readResult}
          </pre>
        </div>
      ) : null}

      {writeError ? (
        <p className="text-xs text-red-600 dark:text-red-400">{writeError.message}</p>
      ) : null}
      {txHash ? (
        <div className="font-mono text-xs">
          <span className="text-slate-500">{t('contractInteract.txHash')}: </span>
          <span className="break-all text-slate-800 dark:text-slate-200">{txHash}</span>
          {txConfirming ? <span className="ml-2 text-slate-500">{t('contractInteract.txPending')}</span> : null}
          {txSuccess ? <span className="ml-2 text-green-600">{t('contractInteract.txSuccess')}</span> : null}
        </div>
      ) : null}
    </div>
  )
}

export function ContractInteractPanel({
  contractAddress,
  methods,
}: {
  contractAddress: string
  methods: ExplorerContractAbiMethodVM[]
}) {
  const { t } = useTranslation('address')
  const publicClient = usePublicClient()
  const connection = useConnection()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const connectors = useConnectors()
  const { connectAsync, isPending: connectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { mutateAsync: sendContractTx, isPending: writePending, error: writeError } = useWriteContract()

  const targetChainId = wagmiConfig.chains[0].id

  const [selectedSignature, setSelectedSignature] = useState(() => methods[0]?.signature ?? '')
  const [actionError, setActionError] = useState<string | null>(null)

  const selectedMethod = useMemo(
    () => methods.find((m) => m.signature === selectedSignature) ?? methods[0],
    [methods, selectedSignature],
  )

  const fragment = useMemo(() => {
    if (!selectedMethod) return null
    try {
      return JSON.parse(selectedMethod.fragmentJson) as {
        inputs?: AbiInputJson[]
        stateMutability?: string
      }
    } catch {
      return null
    }
  }, [selectedMethod])

  const abi = useMemo((): Abi | null => {
    if (!selectedMethod) return null
    try {
      return [JSON.parse(selectedMethod.fragmentJson)] as Abi
    } catch {
      return null
    }
  }, [selectedMethod])

  const inputs = useMemo(() => fragment?.inputs ?? [], [fragment])

  const isPayable = selectedMethod?.stateMutability === 'payable'
  const isRead = Boolean(selectedMethod?.isRead)

  const onConnect = useCallback(async () => {
    const connector = connectors[0]
    if (!connector) {
      setActionError(t('contractInteract.noConnector'))
      return
    }
    setActionError(null)
    await connectAsync({ connector, chainId: targetChainId })
  }, [connectAsync, connectors, targetChainId, t])

  const primaryConnector = connectors[0]

  if (!selectedMethod || !abi) return null

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('contractInteract.title')}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {connection.status === 'connected' && connection.address ? (
            <>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400" title={connection.address}>
                {shortenAddr(connection.address)}
              </span>
              <button
                type="button"
                className="rounded border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium hover:bg-surface"
                onClick={() => void disconnect()}
              >
                {t('contractInteract.disconnect')}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              disabled={!primaryConnector || connectPending}
              onClick={() => void onConnect()}
            >
              {connectPending ? t('common:state.loading') : t('contractInteract.connectWallet')}
            </button>
          )}
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-500">
        {t('contractInteract.rpcHint', { chain: appChain.name, id: targetChainId })}
      </p>

      {actionError ? <p className="mb-2 text-xs text-red-600 dark:text-red-400">{actionError}</p> : null}

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-slate-500">{t('contractInteract.selectMethod')}</span>
          <select
            className="w-full rounded border border-border bg-surface-muted px-2 py-2 font-mono text-xs"
            value={selectedSignature}
            onChange={(e) => setSelectedSignature(e.target.value)}
          >
            {methods.map((m) => (
              <option key={m.signature} value={m.signature}>
                {m.isRead ? `[${t('contractAbiMethodRead')}]` : `[${t('contractAbiMethodWrite')}]`} {m.name}(
                {m.inputs.map((i) => i.typeLabel).join(', ')})
              </option>
            ))}
          </select>
        </label>

        <InteractMethodBody
          key={selectedSignature}
          contractAddress={contractAddress}
          selectedMethod={selectedMethod}
          abi={abi}
          inputs={inputs}
          isRead={isRead}
          isPayable={isPayable}
          publicClient={publicClient}
          connection={connection}
          chainId={chainId}
          targetChainId={targetChainId}
          sendContractTx={sendContractTx}
          writePending={writePending}
          writeError={writeError}
          switchChainAsync={switchChainAsync}
        />
      </div>
    </section>
  )
}
