export interface CategoryConfig {
  id: string
  title: string
  description: string
  icon: string
  dbCategory: string
}

export const categoryConfigs: CategoryConfig[] = [
  {
    id: 'real-estate',
    title: 'املاک',
    description: 'دستیارهای هوشمند مخصوص مشاوران املاک و فعالان صنعت مسکن',
    icon: '🏠',
    dbCategory: 'املاک',
  },
  {
    id: 'marketing',
    title: 'فروش و بازاریابی',
    description: 'دستیارهای هوشمند برای تولید محتوا و تحلیل رقبا',
    icon: '📊',
    dbCategory: 'فروش و بازاریابی',
  },
  {
    id: 'social',
    title: 'محتوای شبکه اجتماعی',
    description: 'دستیارهای هوشمند برای تولید و تحلیل محتوای شبکه‌های اجتماعی',
    icon: '📱',
    dbCategory: 'محتوای شبکه اجتماعی',
  },
]

export function getCategoryConfig(slug: string) {
  return categoryConfigs.find((category) => category.id === slug)
}
