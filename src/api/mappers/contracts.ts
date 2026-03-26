import { mapAbiToCallableMethods } from '@/utils/abiMethods'
import type { ExplorerContractSourceFileVM, ExplorerContractVM } from '../view-models'

function normalizeAbi(raw: unknown): string | null {
  if (raw == null) return null
  if (typeof raw === 'string') return raw
  try {
    return JSON.stringify(raw, null, 2)
  } catch {
    return String(raw)
  }
}

export function mapSmartContract(raw: unknown): ExplorerContractVM {
  const r = raw as Record<string, unknown>
  const adds = Array.isArray(r.additional_sources) ? r.additional_sources : []
  const additionalSources: ExplorerContractSourceFileVM[] = adds.map((item) => {
    const x = item as Record<string, unknown>
    return {
      filePath: String(x.file_path ?? x.filePath ?? ''),
      sourceCode: typeof x.source_code === 'string' ? x.source_code : '',
    }
  })
  const abiRaw = r.abi
  return {
    name: (r.name as string | undefined) ?? null,
    isVerified: Boolean(r.is_verified ?? r.is_fully_verified),
    compilerVersion: (r.compiler_version as string | undefined) ?? null,
    language: (r.language as string | undefined) ?? null,
    filePath: (r.file_path as string | undefined) ?? null,
    sourceCode: (r.source_code as string | undefined) ?? null,
    abi: normalizeAbi(abiRaw),
    abiMethods: mapAbiToCallableMethods(abiRaw),
    additionalSources,
  }
}
