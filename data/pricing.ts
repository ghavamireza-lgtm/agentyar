import type { PricingPlan } from '@/types'

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'رایگان',
    price: '۰',
    currency: 'تومان',
    description: 'مناسب برای شروع و آشنایی با دستیارها',
    features: [
      'دسترسی به تمام دستیارها',
      '۵ درخواست رایگان در ماه',
      'پشتیبانی معمولی',
      'خروجی پایه',
    ],
    buttonText: 'شروع رایگان',
    buttonVariant: 'outline',
  },
  {
    id: 'plus',
    name: 'تجاری',
    price: '۲۹۰٬۰۰۰',
    currency: 'تومان/ماه',
    description: 'مناسب برای کسب‌وکارهای متوسط',
    features: [
      'دسترسی به تمام دستیارها',
      'درخواست نامحدود',
      'پشتیبانی اختصاصی',
      'خروجی پیشرفته',
      'اولویت پردازش',
    ],
    buttonText: 'شروع تجاری',
    buttonVariant: 'primary',
    popular: true,
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    price: '۹۹۰٬۰۰۰',
    currency: 'تومان/ماه',
    description: 'مناسب برای کسب‌وکارهای حرفه‌ای',
    features: [
      'دسترسی به تمام دستیارها',
      'درخواست نامحدود',
      'پشتیبانی اختصاصی',
      'خروجی پیشرفته',
      'اولویت پردازش',
    ],
    buttonText: 'شروع حرفه‌ای',
    buttonVariant: 'primary',
  },
]
