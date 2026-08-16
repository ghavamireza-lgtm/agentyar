import { Suspense } from 'react'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
