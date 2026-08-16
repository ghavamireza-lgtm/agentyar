'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  slug: string
  title: string
  titleEn: string
  description: string
  icon: string
  color: string
}

const categories: Category[] = [
  {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'املاک',
    titleEn: 'Real Estate',
    description: 'دستیارهای هوشمند برای مشاوران املاک و فعالان صنعت مسکن. قیمت‌گذاری، نوشتن آگهی و تحلیل بازار',
    icon: '🏠',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'marketing',
    slug: 'marketing',
    title: 'فروش و بازاریابی',
    titleEn: 'Marketing & Sales',
    description: 'دستیارهای هوشمند برای تولید محتوای فروش، تحلیل رقبا و ایجاد استراتژی‌های بازاریابی',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'social',
    slug: 'social',
    title: 'شبکه‌های اجتماعی',
    titleEn: 'Social Media',
    description: 'دستیارهای هوشمند برای تولید محتوای شبکه‌های اجتماعی، هشتگ، و بهینه‌سازی نوشته‌ها',
    icon: '📱',
    color: 'from-orange-500 to-red-500',
  },
]

export default function SelectCategoryPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectCategory = async (categoryId: string) => {
    setSelectedId(categoryId)
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user-selections/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: categoryId,
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

      // Redirect to pricing page
      setTimeout(() => {
        router.push('/pricing')
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی در ارتباط رخ داد')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← بازگشت به خانه
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            حوزه فعالیت خود را انتخاب کنید
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            دستیارهای هوشمندی متناسب با نیازهای حوزه فعالیت‌تان را کشف کنید
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group cursor-pointer"
              onClick={() => handleSelectCategory(category.id)}
            >
              {/* Card */}
              <div
                className={`h-full rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${
                  selectedId === category.id ? 'border-blue-500 shadow-xl' : ''
                } ${isLoading && selectedId === category.id ? 'opacity-75' : ''}`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-6`}>
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">
                  {category.titleEn}
                </p>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-8">
                  {category.description}
                </p>

                {/* Button */}
                <button
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedId === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } ${isLoading && selectedId === category.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading && selectedId === category.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
                      در حال بارگذاری...
                    </span>
                  ) : selectedId === category.id ? (
                    'انتخاب شد ✓'
                  ) : (
                    'انتخاب این حوزه'
                  )}
                </button>

                {/* Check Mark */}
                {selectedId === category.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 نکتۀ مهم
          </h3>
          <p className="text-blue-800">
            پس از انتخاب حوزه‌ای، می‌توانید بسته‌ای مناسب انتخاب کنید و به دستیارهای تخصصی دسترسی داشته باشید.
          </p>
        </div>
      </div>
    </div>
  )
}
