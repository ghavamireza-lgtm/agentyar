import Link from 'next/link'
import type { Metadata } from 'next'
import { pricingPlans } from '@/data/agents'

export const metadata: Metadata = {
  title: 'تعرفه‌ها',
  description: 'پلن‌های رایگان و حرفه‌ای ایجنت‌یار',
}

export default function PricingPage() {
  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="section-title">تعرفه‌ها</h1>
          <p className="section-subtitle">
            پلنی را انتخاب کنید که با نیاز کسب‌وکار شما هماهنگ باشد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative flex flex-col ${
                plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  محبوب‌ترین
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
                href="/category/real-estate"
                className={plan.buttonVariant === 'primary' ? 'btn-primary w-full text-center' : 'btn-outline w-full text-center'}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-12 max-w-xl mx-auto">
          تمام پلن‌ها شامل دسترسی به دستیارهای هوشمند هستند. برای سوالات بیشتر با ما در تماس باشید.
        </p>
      </div>
    </div>
  )
}
