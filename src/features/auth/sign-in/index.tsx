import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { login } from '@/store/authSlice'

export default function SignIn() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = (email: string, password: string) => {
    if (email === 'admin@gmail.com' && password === 'Admin123!') {
      dispatch(login({ email }))
      navigate({ to: '/' })
    } else {
      // Handle invalid credentials
      alert('Invalid credentials')
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
