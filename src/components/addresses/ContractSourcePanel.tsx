import { useTranslation } from 'react-i18next'
import type { ExplorerContractVM } from '@/api/view-models'
import { ContractAbiMethods } from '@/components/addresses/ContractAbiMethods'
import { flattenContractSources } from '@/utils/contractSource'
import { CopyButton } from '@/components/common/CopyButton'

export function ContractSourcePanel({ vm }: { vm: ExplorerContractVM }) {
  const { t } = useTranslation('address')
  const files = flattenContractSources(vm)

  return (
    <div className="space-y-4">
      <dl className="grid gap-2 rounded-lg border border-border bg-surface p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('contractMeta.name')}</dt>
          <dd className="mt-1 font-medium">{vm.name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('contractMeta.compiler')}</dt>
          <dd className="mt-1 font-mono text-xs">{vm.compilerVersion ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('contractMeta.language')}</dt>
          <dd className="mt-1">{vm.language ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">{t('contractMeta.verified')}</dt>
          <dd className="mt-1">{vm.isVerified ? t('contractMeta.yes') : t('contractMeta.no')}</dd>
        </div>
      </dl>

      {vm.abiMethods.length > 0 ? <ContractAbiMethods methods={vm.abiMethods} /> : null}

      {!vm.isVerified && files.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-slate-600">
          {t('contractNotVerified')}
        </p>
      ) : files.length === 0 ? (
        <p className="text-slate-600">{t('contractNoSource')}</p>
      ) : (
        <div className="space-y-6">
          {files.map((f) => (
            <div key={f.path}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-sm font-medium text-slate-800 dark:text-slate-100">{f.path}</h3>
                <CopyButton text={f.code} />
              </div>
              <pre className="max-h-[min(70vh,32rem)] overflow-auto rounded-lg border border-border bg-slate-950 p-4 text-xs text-slate-100">
                <code>{f.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {vm.abi && vm.abi.length > 0 ? (
        <details className="rounded-lg border border-border bg-surface">
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium">{t('contractAbi')}</summary>
          <pre className="max-h-64 overflow-auto border-t border-border p-4 text-xs font-mono text-slate-800 dark:text-slate-200">
            {vm.abi}
          </pre>
        </details>
      ) : null}
    </div>
  )
}
