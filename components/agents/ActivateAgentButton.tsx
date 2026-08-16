'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/types'

interface ActivateAgentButtonProps {
  agent: Agent
}

export default function ActivateAgentButton({ agent }: ActivateAgentButtonProps) {
  const [isActivating, setIsActivating] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activationError, setActivationError] = useState<string | null>(null)
  const router = useRouter()

  const handleActivate = async () => {
    setIsActivating(true)
    setActivationError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/agents/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agent.id }),
      })

      const data = await res.json()

      // قبلاً فعال بوده = موفقیت نرم
      const alreadyActive =
        typeof data.error === 'string' &&
        data.error.includes('قبلاً')

      if ((!res.ok || !data.success) && !alreadyActive) {
        setActivationError(data.error || 'خطایی رخ داد')
        if (res.status === 401) {
          router.push('/login')
        }
        return
      }

      setIsActivated(true)
      setSuccessMessage(
        data.message ||
          (alreadyActive
            ? 'این دستیار از قبل برای شما فعال است'
            : 'دستیار با موفقیت فعال شد')
      )

      // داشبورد و لیست agentهای فعال را به‌روز کن
      router.refresh()
    } catch (error) {
      setActivationError(
        error instanceof Error ? error.message : 'خطایی در ارتباط رخ داد'
      )
    } finally {
      setIsActivating(false)
    }
  }

  if (isActivated) {
    return (
      <div className="card border-green-200 bg-green-50 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <h3 className="font-semibold text-green-900">
              {successMessage || 'دستیار فعال شد'}
            </h3>
            <p className="text-sm text-green-700 mt-0.5">
              اکنون می‌توانید فرم زیر را پر کنید و نتیجه بگیرید. از داشبورد هم
              قابل مشاهده است.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-3 text-sm font-medium text-green-800 underline hover:text-green-900"
            >
              رفتن به داشبورد ←
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card border-primary-200 bg-primary-50 mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">این دستیار را فعال کنید</h3>
          <p className="text-sm text-gray-600 mt-1">
            برای استفاده از این دستیار باید آن را فعال کنید
          </p>
        </div>
        <button
          onClick={handleActivate}
          disabled={isActivating}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isActivating ? 'درحال فعال‌سازی...' : 'فعال کن'}
        </button>
      </div>

      {activationError && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {activationError}
        </div>
      )}
    </div>
  )
}
