/**
 * 原生币符号，来自环境变量 `VITE_APP_NATIVE_SYMBOL`。
 * 未设置或为空时返回空字符串，界面只展示数值，不附带任何默认符号（如 ETH）。
 */
export function getNativeSymbol(): string {
  const raw = import.meta.env.VITE_APP_NATIVE_SYMBOL
  if (typeof raw !== 'string') return ''
  return raw.trim()
}
