'use client'

import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserWarehousePermissionType } from './type'

// Atom for apiKey
export const apiKeyAtom = atom<string | null>(null)

// Atom for warehouse permission
export const warehousePermissionAtom = atom<UserWarehousePermissionType | null>(
  null
)

// Loading atom
export const isPermissionLoadingAtom = atom(true)

// Hook to initialize permission data from localStorage
export const useInitializeUserPermission = () => {
  const setApiKey = useSetAtom(apiKeyAtom)
  const setWarehouse = useSetAtom(warehousePermissionAtom)
  const setIsLoading = useSetAtom(isPermissionLoadingAtom)
  const router = useRouter()

  useEffect(() => {
    const loadPermission = () => {
      setIsLoading(true)

      const apiKey = localStorage.getItem('apiKey')
      const warehouseStr = localStorage.getItem('warehouse')

      if (apiKey) {
        setApiKey(apiKey)
      } else {
        setApiKey(null)
      }

      if (warehouseStr) {
        setWarehouse(JSON.parse(warehouseStr))
      } else {
        setWarehouse(null)
      }

      console.log('Permission loaded:', {
        apiKey,
        warehouse: warehouseStr,
      })

      setIsLoading(false)
    }

    if (typeof window !== 'undefined') {
      loadPermission()
    }
  }, [setApiKey, setWarehouse, setIsLoading, router])
}
