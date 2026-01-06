'use client'

import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { User2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

const Navbar = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  console.log('🚀 ~ Navbar ~ userData:', userData)
  const pathname = usePathname()
  const router = useRouter()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('warehouse')
    localStorage.removeItem('apiKey')
    setIsProfileOpen(false)
    router.push('/')
  }

  const linkBaseClass =
    'border rounded-md p-1 w-32 text-center transition-colors'

  const activeClass = 'bg-white border border-slate-200 custom-shadow'
  const inactiveClass = 'border-slate-300 hover:bg-slate-50 bg-slate-50'

  return (
    <div className="p-5 rounded-md border m-5 bg-slate-200 shadow-md flex justify-between items-center">
      <div className="flex justify-start items-center space-x-4 ">
        <Link
          href="/item-view"
          className={`w-3${linkBaseClass} ${
            pathname === '/item-view' ? activeClass : inactiveClass
          }`}
        >
          Item View
        </Link>

        <Link
          href="/delivery-notes"
          className={`${linkBaseClass} ${
            pathname === '/delivery-notes' ||
            pathname.startsWith('/delivery-note-details')
              ? activeClass
              : inactiveClass
          }`}
        >
          Delivery Notes
        </Link>
      </div>
      <div className="flex space-x-2 items-center">
        <div
          className="relative flex items-center pl-3 custom-shadow border border-slate-200 rounded-full"
          ref={profileRef}
        >
          <p className='pr-2'>{userData}</p>
          <button
            className="flex items-center justify-center  text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-500 ease-in-out"
            id="user-menu"
            aria-label="User menu"
            aria-haspopup="true"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User2 className="h-7 w-7 text-gray-600 border border-gray-600 p-1 rounded-full" />
          </button>
          {isProfileOpen && (
            <div className="origin-top-right absolute right-0 mt-24 w-48 rounded-md shadow-lg">
              <div
                className="py-1 rounded-md bg-white shadow-xs"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
