'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, LockIcon, LogIn, User2, AlertCircle } from 'lucide-react'
import { getUserDetAssWarehouse, getUserPermission, signIn } from '@/utils/api'
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [usr, setusr] = useState('')
  const [pwd, setpwd] = useState('')
  const [showpwd, setShowpwd] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!usr || !pwd) {
      setError('Please fill in all fields.')
      setIsLoading(false)
      return
    }

    try {
      const loginResponse = await signIn({ usr: usr, pwd: pwd })
      console.log('🚀 ~ handleSubmit ~ loginResponse:', loginResponse)
      if (loginResponse.error || !loginResponse.data) {
        toast({
          title: 'Error',
          description: loginResponse.error?.message || 'Failed to signin',
        })
      } else {
        router.push('/item-view')
        toast({
          title: 'Success',
          description: 'You are signed in',
        })
        localStorage.setItem('user', usr)
        const response = await getUserDetAssWarehouse()
        console.log('🚀 ~ handleSubmit ~ response:', response)

        let apiKey = response.data.message
        const usrPermissions = await getUserPermission(usr)
        console.log(
          '🚀 ~ handleSubmit ~ usrPermissions(warehouse):',
          usrPermissions?.data?.data
        )

        let warehouse = usrPermissions?.data?.data
        if (!warehouse) {
          alert(
            'Login successful, but no Warehouse is assigned to your user account in ERPNext.'
          )
          toast({
            title: 'Error',
            variant: 'destructive',
            description: 'Login successful, but no Warehouse is assigned to your user account in ERPNext.',
          })
          return
        }
        localStorage.setItem('apiKey', apiKey)
        localStorage.setItem('warehouse', JSON.stringify(warehouse))
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-sm bg-white shadow-xl border-0">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                height={120}
                className="rounded-lg"
              />
          </div>
          <div className="text-center">
            {/* <CardTitle className="text-2xl font-bold text-gray-900">
              Sign in to your account
            </CardTitle> */}
            <CardDescription className="text-gray-600 mt-2">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="usr" className="flex items-center text-gray-700 font-medium">
                <User2 className="w-4 h-4 mr-2 text-[#42af4b]" />
                <span>Username / Email</span>
              </Label>
              <Input
                id="usr"
                type="text"
                placeholder="Enter your username or email"
                className="border-gray-300 focus:border-[#42af4b] focus:ring-[#42af4b] h-11"
                value={usr}
                onChange={(e) => setusr(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd" className="flex items-center text-gray-700 font-medium">
                <LockIcon className="w-4 h-4 mr-2 text-[#42af4b]" />
                <span>Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="pwd"
                  placeholder="Enter your password"
                  className="border-gray-300 focus:border-[#42af4b] focus:ring-[#42af4b] h-11 pr-10"
                  type={showpwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setpwd(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowpwd(!showpwd)}
                >
                  {showpwd ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-[#42af4b] hover:bg-[#3ba844] text-white h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}