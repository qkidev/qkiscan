import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { classifySearchInput } from '@/utils/validators'
import { isAddress } from '@/utils/address'
import { looksLikeTxHash } from '@/utils/hash'

/** 搜索框：解析输入并跳转（PRD §17） */
export function useSearchNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (raw: string) => {
      const q = raw.trim()
      if (!q) return
      const kind = classifySearchInput(q)
      if (kind === 'address' && isAddress(q)) {
        navigate(`/address/${q}`)
        return
      }
      if (kind === 'tx' && looksLikeTxHash(q)) {
        navigate(`/tx/${q}`)
        return
      }
      if (kind === 'block_height') {
        navigate(`/blocks/${q}`)
        return
      }
      navigate({ pathname: '/search', search: `?q=${encodeURIComponent(q)}` })
    },
    [navigate],
  )
}
