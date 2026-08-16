import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
