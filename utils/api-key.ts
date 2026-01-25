// utils/api-key.ts
type WarehouseKey = { name: string; key: string }

export const resolveApiKey = (): string | undefined => {
  if (typeof window === 'undefined') return undefined

  const userStr = localStorage.getItem('user')
  if (!userStr) return undefined

  const rawKeys = process.env.NEXT_PUBLIC_WAREHOUSE_KEYS
  if (!rawKeys) return undefined

  try {
    const keys: WarehouseKey[] = JSON.parse(rawKeys)
    return keys.find((k) => k.name === userStr)?.key
  } catch {
    console.error('Invalid NEXT_PUBLIC_WAREHOUSE_KEYS JSON')
    return undefined
  }
}
