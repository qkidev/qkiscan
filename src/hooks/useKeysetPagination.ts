import { useCallback, useMemo, useState } from 'react'
import type { NextPageParams } from '@/api/types'

export function useKeysetPagination() {
  const [cursor, setCursor] = useState<NextPageParams | null>(null)
  const [prevStack, setPrevStack] = useState<NextPageParams[]>([])

  const reset = useCallback(() => {
    setCursor(null)
    setPrevStack([])
  }, [])

  const goNext = useCallback((next: NextPageParams) => {
    if (!next || typeof next !== 'object' || Object.keys(next).length === 0) return
    setPrevStack((s) => [...s, cursor])
    setCursor(next)
  }, [cursor])

  const goPrev = useCallback(() => {
    setPrevStack((s) => {
      if (s.length === 0) return s
      const prevCursor = s[s.length - 1] ?? null
      setCursor(prevCursor)
      return s.slice(0, -1)
    })
  }, [])

  const requestCursor = useMemo(() => cursor, [cursor])
  const canGoPrev = prevStack.length > 0

  return { requestCursor, goNext, goPrev, canGoPrev, reset }
}
