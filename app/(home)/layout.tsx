'use client'

import '.././globals.css'
import React from 'react'
import Navbar from '@/components/shared/navbar'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { ReactQueryProvider } from '@/provider/ReactQueryProvider'
import { Toaster } from '@/components/ui/toaster'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {pathname !== '/' && <Navbar />}
          <main className={`${(pathname !== '/') && 'p-6'}`}>
            {children}
          </main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
