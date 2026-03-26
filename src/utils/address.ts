const ADDR_RE = /^0x[a-fA-F0-9]{40}$/

export function isAddress(value: string): boolean {
  return ADDR_RE.test(value.trim())
}

export function normalizeAddress(value: string): string | null {
  const v = value.trim()
  if (!isAddress(v)) return null
  return v.toLowerCase()
}

export function shortenAddress(address: string, left = 6, right = 4): string {
  if (!address || address.length <= left + right + 2) return address
  return `${address.slice(0, left)}...${address.slice(-right)}`
}
