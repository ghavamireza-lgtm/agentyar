// data/agents.ts
import type { Agent, Category } from '../types/index'

export const categories: Record<string, Category> = {
  'business': {
    id: 'business',
    title: 'دستیارهای کسب‌وکار',
    description: 'سه دستیار هوشمند برای نیازهای اصلی کسب‌وکار شما',
    icon: '🚀',
    agents: [
      {
        id: 'sales-marketing',
        name: 'فروش و بازاریابی',
        category: 'کسب‌وکار',
        description: 'تولید محتوای فروش، پیام تبلیغاتی و تحلیل رقبا',
        icon: '📊',
        fields: [
          { id: 'product', label: 'نام محصول یا خدمت', type: 'text', placeholder: 'مثلاً نرم‌افزار مدیریت فروش', required: true },
          { id: 'audience', label: 'مخاطب هدف', type: 'text', placeholder: 'مثلاً صاحبان کسب‌وکار کوچک', required: true },
          { id: 'goal', label: 'هدف اصلی', type: 'textarea', placeholder: 'چه چیزی می‌خواهید به دست بیاورید؟', required: true }
        ]
      },
      {
        id: 'real-estate',
        name: 'مشاور املاک',
        category: 'کسب‌وکار',
        description: 'قیمت‌گذاری ملک و نوشتن آگهی حرفه‌ای',
        icon: '🏠',
        fields: [
          { id: 'property_type', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'مغازه'], required: true },
          { id: 'area', label: 'مساحت (متر)', type: 'number', placeholder: 'مثلاً ۱۲۰', required: true },
          { id: 'location', label: 'محله', type: 'text', placeholder: 'مثلاً شهرک غرب', required: true }
        ]
      },
      {
        id: 'social-content',
        name: 'محتوای شبکه‌های اجتماعی',
        category: 'کسب‌وکار',
        description: 'تولید کپشن، پست و ایده محتوا برای اینستاگرام و سایر پلتفرم‌ها',
        icon: '📱',
        fields: [
          { id: 'topic', label: 'موضوع محتوا', type: 'text', placeholder: 'مثلاً معرفی محصول جدید', required: true },
          { id: 'platform', label: 'پلتفرم', type: 'select', options: ['اینستاگرام', 'لینکدین', 'توییتر', 'تلگرام'], required: true },
          { id: 'tone', label: 'لحن', type: 'select', options: ['صمیمی', 'حرفه‌ای', 'طنز', 'الهام‌بخش'], required: true }
        ]
      }
    ]
  }
}

export const agentsList = Object.values(categories).flatMap(cat => cat.agents)

export function getAgentById(id: string): Agent | undefined {
  return agentsList.find(agent => agent.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories[slug]
}

export function getAllAgentIds() {
  return agentsList.map(agent => ({ id: agent.id }))
}