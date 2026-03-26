import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { ExplorerContractAbiMethodVM } from '@/api/view-models'
import { CopyButton } from '@/components/common/CopyButton'

export function ContractAbiMethods({ methods }: { methods: ExplorerContractAbiMethodVM[] }) {
  const { t } = useTranslation('address')
  if (methods.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-surface">
      <h3 className="border-b border-border px-4 py-2 text-sm font-medium">{t('contractAbiMethods')}</h3>
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
              <tr key={`${m.signature}-${i}`} className="border-b border-border last:border-0">
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
                  {m.inputs.length === 0
                    ? '—'
                    : m.inputs.map((x) => `${x.name}: ${x.typeLabel}`).join(', ')}
                </td>
                <td className="px-3 py-2 align-top font-mono text-xs">{m.stateMutability}</td>
                <td className="px-3 py-2 align-top">
                  <CopyButton text={m.fragmentJson} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-slate-500">{t('contractAbiMethodsHint')}</p>
    </div>
  )
}
