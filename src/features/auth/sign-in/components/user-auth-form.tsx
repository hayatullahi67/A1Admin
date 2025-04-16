import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserAuthFormProps {
  onSubmit?: (email: string, password: string) => void
}

export function UserAuthForm({ onSubmit }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    onSubmit?.(email, password)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full'
          required
        />
      </div>
      <div className='space-y-2'>
        <label htmlFor='password' className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full'
          required
        />
      </div>
      <Button type='submit' onClick={handleSubmit} className='w-full' disabled={isLoading}>
        Sign In
      </Button>
    </form>
  )
}
