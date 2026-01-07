'use client'

import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

// user is a string
export const userDataAtom = atom<string | null>(null)
export const isUserLoadingAtom = atom(true)

export const useInitializeUser = () => {
  const setUserData = useSetAtom(userDataAtom)
  const setIsLoading = useSetAtom(isUserLoadingAtom)

  useEffect(() => {
    setIsLoading(true)

    const userStr = localStorage.getItem('user')

    if (userStr) {
      setUserData(userStr) // ✅ direct use
    } else {
      setUserData(null)
    }

    setIsLoading(false)
  }, [setUserData, setIsLoading])
}
