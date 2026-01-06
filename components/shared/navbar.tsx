'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const pathname = usePathname()

  const linkBaseClass =
    'border rounded-md p-1 w-44 text-center transition-colors'

  const activeClass = 'bg-gray-400 text-white border-gray-400'
  const inactiveClass = 'border-gray-300 hover:bg-gray-200'

  return (
    <div className="flex justify-center items-start space-x-4 p-4 bg-gray-100">
      <Link
        href="/item-view"
        className={`${linkBaseClass} ${
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
  )
}

export default Navbar
