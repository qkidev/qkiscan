import type { ExplorerContractVM } from '@/api/view-models'

/** 合并主源码、Hardhat/标准 JSON 多文件包、additional_sources，用于展示 */
export function flattenContractSources(vm: ExplorerContractVM): { path: string; code: string }[] {
  const main = vm.sourceCode
  if (main?.trim().startsWith('{')) {
    try {
      const j = JSON.parse(main) as { sources?: Record<string, { content?: string }> }
      if (j.sources && typeof j.sources === 'object' && Object.keys(j.sources).length > 0) {
        return Object.entries(j.sources).map(([path, v]) => ({
          path,
          code: v?.content ?? '',
        }))
      }
    } catch {
      /* 按单文件展示 */
    }
  }
  const out: { path: string; code: string }[] = []
  if (main && main.trim() !== '') {
    out.push({ path: vm.filePath?.trim() || 'Contract.sol', code: main })
  }
  for (const a of vm.additionalSources) {
    if (a.sourceCode.trim() !== '') {
      out.push({ path: a.filePath || 'file', code: a.sourceCode })
    }
  }
  return out
}
