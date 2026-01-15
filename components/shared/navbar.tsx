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
import {
  User2,
  Menu,
  X,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

const Navbar = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

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
    'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative'

  const activeClass = 'bg-[#42af4b] text-white shadow-md'
  const inactiveClass = 'text-gray-700 hover:bg-gray-100'

  const mobileLinkBaseClass =
    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative'

  const navLinks = [
    {
      href: '/item-view',
      label: 'Item View',
      icon: Package,
      count: null,
      isActive: pathname === '/item-view',
    },
    {
      href: '/delivery-notes',
      label: 'Delivery Notes',
      icon: Truck,
      count: deliveryNotes?.data?.data.length,
      isActive:
        pathname === '/delivery-notes' ||
        pathname.startsWith('/delivery-note-details'),
    },
    {
      href: '/goods-issue',
      label: 'Goods Issue',
      icon: ArrowUpFromLine,
      count: goodsIssue?.data?.data.length,
      isActive:
        pathname === '/goods-issue' ||
        pathname.startsWith('/goods-issue-details'),
    },
    {
      href: '/goods-received',
      label: 'Goods Received',
      icon: ArrowDownToLine,
      count: materialReceivedData?.length,
      isActive:
        pathname === '/goods-received' ||
        pathname.startsWith('/goods-received-details'),
    },
  ]

  return (
    <>
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Hamburger Menu Button */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${linkBaseClass} ${
                      link.isActive ? activeClass : inactiveClass
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    {link.count !== null &&
                      link.count !== undefined &&
                      link.count > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {link.count}
                        </span>
                      )}
                  </Link>
                )
              })}
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User menu"
                >
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {userData}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[#42af4b] flex items-center justify-center">
                    <User2 className="h-5 w-5 text-white" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 md:hidden">
                      <p className="text-sm font-medium text-gray-700">
                        {userData}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
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
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`${mobileLinkBaseClass} ${
                    link.isActive ? activeClass : inactiveClass
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{link.label}</span>
                  {link.count !== null &&
                    link.count !== undefined &&
                    link.count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {link.count}
                      </span>
                    )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar
