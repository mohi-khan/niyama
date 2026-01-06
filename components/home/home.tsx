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
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { getUserDetAssWarehouse, getUserPermission, signIn } from '@/utils/api'
import { toast } from '@/hooks/use-toast'

export default function SignIn() {
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
      const response = await signIn({ usr: usr, pwd: pwd })
      console.log('🚀 ~ handleSubmit ~ response:', response)
      if (response.error || !response.data) {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to signin',
        })
      } else {
        router.push('/item-view')
        toast({
          title: 'Success',
          description: 'you are signined in',
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-black">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            {/* <Image
              src="/logo.webp"
              alt="Company Logo"
              width={80}
              height={80}
              className=""
            /> */}
            <h2 className="text-3xl font-bold ">Niyama</h2>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your usr and pwd to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usr">Username/Email</Label>
              <Input
                id="usr"
                type="text"
                className="border border-black"
                value={usr}
                onChange={(e) => setusr(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 pb-3">
              <Label htmlFor="pwd">Password</Label>
              <div className="relative">
                <Input
                  id="pwd"
                  className="border border-black"
                  type={showpwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setpwd(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowpwd(!showpwd)}
                >
                  {showpwd ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-black text-white hover:text-white"
              disabled={isLoading}
              variant={'outline'}
            >
              <LockIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            href="/forgot-pwd"
            className="text-sm text-center text-primary hover:underline"
          >
            Forgot your pwd?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
