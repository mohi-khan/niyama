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

    const matchedUser = keys.find((k) => k.name === userStr)

    console.log('Current user API key:', matchedUser)
    // localStorage.setItem('apiKey', matchedUser?.key || '')
    return matchedUser?.key
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_WAREHOUSE_KEYS JSON', error)
    return undefined
  }
}
export const getAdminApiKey = (): string | undefined => {
  if (typeof window === 'undefined') return undefined

  const userStr = "administrator"
  if (!userStr) return undefined


  const rawKeys = process.env.NEXT_PUBLIC_WAREHOUSE_KEYS
  if (!rawKeys) return undefined

  try {
    const keys: WarehouseKey[] = JSON.parse(rawKeys)

    const matchedUser = keys.find((k) => k.name === userStr)

  
    // localStorage.setItem('apiKey', matchedUser?.key || '')
    return matchedUser?.key
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_WAREHOUSE_KEYS JSON', error)
    return undefined
  }
}
