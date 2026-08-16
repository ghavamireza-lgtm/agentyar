'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { pricingPlans } from '@/data/pricing'

interface UserSelection {
  selected_category: string | null
  selected_plan_id: string | null
}

const categoryNames: Record<string, string> = {
  'real-estate': 'املاک',
  'marketing': 'فروش و بازاریابی',
  'social': 'شبکه‌های اجتماعی',
}

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserSelection()
  }, [])

  const fetchUserSelection = async () => {
    try {
      const res = await fetch('/api/user-selections/category')
      const data = await res.json()

      if (data.success && data.selection?.selected_category) {
        setSelectedCategory(data.selection.selected_category)
        setSelectedPlan(data.selection.selected_plan_id)
      }
    } catch (err) {
      console.error('Error fetching selection:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (!selectedCategory) {
      setError('لطفاً ابتدا یک حوزه انتخاب کنید')
      return
    }

    setSelectedPlan(planId)
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/user-selections/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'خطایی رخ داد')

        if (res.status === 401) {
          router.push('/login')
        }
        return
      }

      // Redirect to dashboard or category page
      setTimeout(() => {
        router.push(`/category/${selectedCategory}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی در ارتباط رخ داد')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumb & Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedCategory ? (
              <>
                <span>حوزه انتخاب شده:</span>
                <span className="font-semibold text-gray-900 mr-2">
                  {categoryNames[selectedCategory] || selectedCategory}
                </span>
              </>
            ) : (
              <span className="text-red-600">حوزه انتخاب نشده است</span>
            )}
          </div>

          {!selectedCategory && (
            <Link
              href="/select-category"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              انتخاب حوزه ←
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">انتخاب پلن</h1>
          <p className="section-subtitle">
            پلنی را انتخاب کنید که با نیاز کسب‌وکار شما هماهنگ باشد
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-6xl mx-auto p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative flex flex-col transition-all ${
                plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-green-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  محبوب‌ترین
                </span>
              )}

              {selectedPlan === plan.id && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  ✓ انتخاب شد
                </span>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 mr-2">{plan.currency}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={plan.buttonVariant === 'primary' ? 'btn-primary w-full text-center' : 'btn-outline w-full text-center'}
              >
                {isSaving && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
                    در حال پردازش...
                  </span>
                ) : selectedPlan === plan.id ? (
                  'انتخاب شد ✓'
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 درباره این پلن‌ها
          </h3>
          <p className="text-blue-800 text-sm">
            هر پلن شامل دسترسی کامل به تمام دستیارهای حوزه انتخاب‌شده است. 
            می‌توانید هر زمان پلن خود را تغییر دهید.
          </p>
        </div>
      </div>
    </div>
  )
}
