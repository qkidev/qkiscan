import type { NextPageParams } from '../types'

export function pickNextPageParams(raw: { next_page_params?: NextPageParams }): NextPageParams {
  const v = raw.next_page_params
  if (v === undefined || v === null) return null
  if (typeof v === 'object' && Object.keys(v).length === 0) return null
  return v
}

export function parseTxStatus(raw: { status?: string | null; result?: string | null; success?: boolean | null }): 'ok' | 'fail' | 'pending' | 'unknown' {
  if (raw.success === false) return 'fail'
  if (raw.success === true) return 'ok'
  const s = (raw.status ?? raw.result ?? '').toLowerCase()
  if (s.includes('ok') || s === 'success' || s === '1') return 'ok'
  if (s.includes('fail') || s.includes('error') || s === '0') return 'fail'
  if (s.includes('pending')) return 'pending'
  return 'unknown'
}

export function addressFromField(
  v: { hash?: string } | { hash?: string }[] | string | null | undefined,
): string | null {
  if (v == null) return null
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v[0]?.hash ?? null
  return v.hash ?? null
}

export function addressNameFromField(
  v:
    | { hash?: string; name?: string | null }
    | { hash?: string; name?: string | null }[]
    | string
    | null
    | undefined,
): string | null {
  if (v == null || typeof v === 'string') return null
  const raw = Array.isArray(v) ? v[0]?.name : v.name
  if (typeof raw !== 'string') return null
  const s = raw.trim()
  return s === '' ? null : s
}
