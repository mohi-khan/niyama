'use client'

import {
  useGetDeliveryNote,
  useGetGoodsIssue,
  useGetGoodsReceived,
  useGetItems,
} from '@/hooks/use-api'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { warehousePermissionAtom } from '@/utils/user-permission'
import { useAtom } from 'jotai'
import { User2, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

const Navbar = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: items } = useGetItems()
  const { data: deliveryNotes } = useGetDeliveryNote(warehouse)
  const { data: goodsIssue } = useGetGoodsIssue(warehouse)
  const { data: goodsReceived } = useGetGoodsReceived(warehouse)

  const materialReceivedData = goodsReceived?.data?.data?.filter(
    (item) => item.stock_entry_type === 'Material Transfer'
  )

  const pathname = usePathname()
  const router = useRouter()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('warehouse')
    localStorage.removeItem('apiKey')
    setIsProfileOpen(false)
    router.push('/')
  }

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setTimeout(() => {
      router.push(href)
    }, 500)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when route changes with delay
  useEffect(() => {
    if (pathname) {
      const timer = setTimeout(() => {
        setIsMobileMenuOpen(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const linkBaseClass =
    'border rounded-md p-1 w-48 text-center transition-colors relative'

  const activeClass = 'bg-white border border-slate-200 custom-shadow'
  const inactiveClass = 'border-slate-300 hover:bg-slate-50 bg-slate-50'

  const mobileLinkBaseClass =
    'border rounded-md p-3 text-center transition-colors w-full relative'

  const navLinks = [
    {
      href: '/item-view',
      label: 'Item View',
      count: null,
      isActive: pathname === '/item-view',
    },
    {
      href: '/delivery-notes',
      label: 'Delivery Notes',
      count: deliveryNotes?.data?.data.length,
      isActive:
        pathname === '/delivery-notes' ||
        pathname.startsWith('/delivery-note-details'),
    },
    {
      href: '/goods-issue',
      label: 'Goods Issue',
      count: goodsIssue?.data?.data.length,
      isActive:
        pathname === '/goods-issue' ||
        pathname.startsWith('/goods-issue-details'),
    },
    {
      href: '/goods-received',
      label: 'Goods Received',
      count: materialReceivedData?.length,
      isActive:
        pathname === '/goods-received' ||
        pathname.startsWith('/goods-received-details'),
    },
  ]

  return (
    <>
      <div className="p-5 rounded-md border m-5 bg-slate-200 shadow-md flex justify-between items-center">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden flex items-center justify-center p-1 rounded-md transition-colors custom-shadow border "
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex justify-start items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkBaseClass} ${
                link.isActive ? activeClass : inactiveClass
              }`}
            >
              {link.label}
              {link.count !== null && link.count !== undefined && link.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {link.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className="flex space-x-2 items-center">
          <div
            className="relative flex items-center md:pl-3 custom-shadow border border-slate-200 rounded-full"
            ref={profileRef}
          >
            <p className="pr-2 hidden md:block">{userData}</p>
            <button
              className="flex items-center justify-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-500 ease-in-out"
              id="user-menu"
              aria-label="User menu"
              aria-haspopup="true"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User2 className="h-7 w-7 text-gray-600 border border-gray-600 p-1 rounded-full" />
            </button>
            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 md:mt-24 mt-36 w-48 rounded-md shadow-lg z-50">
                <div
                  className="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-3 border-b border-slate-200 md:hidden block">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-700">
                        {userData}
                      </p>
                    </div>
                  </div>
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

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-out Menu */}
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col space-y-3 p-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`${mobileLinkBaseClass} ${
                  link.isActive ? activeClass : inactiveClass
                }`}
              >
                {link.label}
                {link.count !== null && link.count !== undefined && link.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {link.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar
