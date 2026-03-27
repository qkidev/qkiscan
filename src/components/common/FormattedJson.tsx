import { useMemo, type ReactNode } from 'react'
import { normalizeJsonValue } from '@/utils/normalizeJsonValue'

function JsonNode({ value }: { value: unknown }): ReactNode {
  if (value === null) return <span className="text-violet-400">null</span>
  if (value === undefined) return <span className="text-slate-500">undefined</span>

  const t = typeof value
  if (t === 'boolean') return <span className="text-violet-400">{value ? 'true' : 'false'}</span>
  if (t === 'number') return <span className="text-amber-400">{String(value)}</span>
  if (t === 'bigint') return <span className="text-amber-400">{value.toString()}</span>
  if (t === 'string') {
    return <span className="break-all text-emerald-300">{JSON.stringify(value)}</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400">[]</span>
    return (
      <ul className="ml-0 list-none space-y-2 border-l border-slate-600 pl-3">
        {value.map((item, i) => (
          <li key={i} className="pl-0">
            <span className="select-none text-slate-500">{i}: </span>
            <JsonNode value={item} />
          </li>
        ))}
      </ul>
    )
  }

  if (t === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return <span className="text-slate-400">{'{}'}</span>
    return (
      <dl className="space-y-2 border-l border-slate-600 pl-3">
        {entries.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="inline font-medium text-sky-400">{JSON.stringify(k)}</dt>
            <span className="text-slate-500">: </span>
            <dd className="inline-block min-w-0 max-w-full align-top">
              <JsonNode value={v} />
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return <span className="text-slate-300">{String(value)}</span>
}

export function FormattedJson({ data }: { data: unknown }) {
  const normalized = useMemo(() => normalizeJsonValue(data), [data])
  return (
    <div className="max-h-[min(80vh,36rem)] overflow-auto rounded-lg border border-border bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
      <JsonNode value={normalized} />
    </div>
  )
}
