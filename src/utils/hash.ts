export function shortenHash(hash: string, left = 8, right = 6): string {
  if (!hash || hash.length <= left + right + 2) return hash
  return `${hash.slice(0, left)}...${hash.slice(-right)}`
}

export function looksLikeTxHash(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value.trim())
}
