import { Card } from '@/components/ui/card'

import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { login } from '@/store/authSlice'
export default function SignIn() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('https://api.a1schools.org/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
  
      const data = await response.json()
  
  
      console.log("Login response data:", data) // 👈 Log the whole response
     
     
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
  
      const userData = data.data
      const userRoles = userData.roles || []
  
      const isAdmin = userRoles.some((role: any) => role.name === 'admin')
  
      if (!isAdmin) {
        throw new Error('Access denied. You must be an admin to log in.')
      }
  
      // Check what the actual structure looks like before trying to read email
      // Example fallback structure:
      

      dispatch(login({ email: data.email, }))
      localStorage.setItem("user", JSON.stringify({
        email: data.data.email,
        token: data.data.token,
        fullname: data.data.fullname,
        id: data.data.id
      }))
      console.log("local",localStorage)
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Login error:', error)
      alert(error.message || 'Invalid credentials')
    }
  }
  
  

  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email and password below <br />
            to log into your account 
          </p>
        </div>
        <UserAuthForm onSubmit={handleLogin} />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          By clicking login, you agree to our{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Privacy Policy
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}