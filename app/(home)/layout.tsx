import { Toaster } from '@/components/ui/toaster'
import '.././globals.css'
import { Inter } from 'next/font/google'
import { ReactQueryProvider } from '@/provider/ReactQueryProvider'
import Navbar from '@/components/shared/navbar'

const inter = Inter({ subsets: ['latin'] })

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="">
          <ReactQueryProvider>
            <Navbar />
            <main className="p-6">{children}</main>
            <Toaster />
          </ReactQueryProvider>
          {/* <div className="bg-white rounded">{children}</div>
          <Toaster /> */}
        </div>
      </body>
    </html>
  )
}
