import axios, { type AxiosError } from 'axios'

const baseURL =
  typeof import.meta.env.VITE_APP_API_BASE === 'string' && import.meta.env.VITE_APP_API_BASE.length > 0
    ? import.meta.env.VITE_APP_API_BASE
    : '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
})

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    const msg = `[api] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`
    if (typeof console !== 'undefined' && 'debug' in console) {
      console.debug(msg, config.params)
    }
  }
  return config
})

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function normalizeAxiosError(err: unknown): never {
  if (!axios.isAxiosError(err)) throw err
  const ax = err as AxiosError<{ message?: string; error?: string }>
  const status = ax.response?.status ?? 0
  const body = ax.response?.data
  const msg =
    (typeof body === 'object' && body && 'message' in body && typeof body.message === 'string'
      ? body.message
      : null) ||
    (typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
      ? body.error
      : null) ||
    ax.message ||
    'Request failed'
  throw new ApiError(msg, status, ax.code)
}

export async function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const res = await promise
    return res.data
  } catch (e) {
    return normalizeAxiosError(e)
  }
}
