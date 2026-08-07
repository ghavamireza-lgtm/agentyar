// src/data/agents.ts
import type { Agent, Category } from '../types/index'

export const categories: Record<string, Category> = {
  'real-estate': {
    id: 'real-estate',
    title: 'املاک',
    description: 'دستیارهای هوشمند مخصوص مشاوران املاک و فعالان صنعت مسکن',
    icon: '🏠',
    agents: [
      {
        id: 'price-advisor',
        name: 'مشاور قیمت‌گذاری ملک',
        category: 'املاک',
        description: 'با وارد کردن مشخصات ملک، قیمت پیشنهادی مناسب را دریافت کنید',
        icon: '💰',
        fields: [
          { id: 'area', label: 'مساحت (متر مربع)', type: 'number', placeholder: 'مثلاً ۱۲۰', required: true },
          { id: 'bedrooms', label: 'تعداد اتاق خواب', type: 'number', placeholder: 'مثلاً ۳', required: true },
          { id: 'age', label: 'سن بنا (سال)', type: 'number', placeholder: 'مثلاً ۵', required: true },
          { id: 'location', label: 'محله', type: 'text', placeholder: 'مثلاً شهرک غرب', required: true },
          { id: 'floor', label: 'طبقه', type: 'text', placeholder: 'مثلاً سوم', required: false },
          { id: 'features', label: 'امکانات ویژه', type: 'textarea', placeholder: 'مثلاً آسانسور، پارکینگ، انباری', required: false }
        ]
      },
      {
        id: 'ad-writer',
        name: 'نویسنده آگهی ملک',
        category: 'املاک',
        description: 'مشخصات ملک خود را وارد کنید تا یک آگهی جذاب و حرفه‌ای دریافت کنید',
        icon: '✍️',
        fields: [
          { id: 'property_type', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'دفتر کار'], required: true },
          { id: 'area', label: 'مساحت (متر مربع)', type: 'number', placeholder: 'مثلاً ۱۲۰', required: true },
          { id: 'bedrooms', label: 'تعداد اتاق خواب', type: 'number', placeholder: 'مثلاً ۳', required: true },
          { id: 'location', label: 'موقعیت مکانی', type: 'text', placeholder: 'مثلاً شهرک غرب، خیابان گلستان', required: true },
          { id: 'price', label: 'قیمت (تومان)', type: 'text', placeholder: 'مثلاً ۳ میلیارد', required: true },
          { id: 'features', label: 'امکانات و ویژگی‌ها', type: 'textarea', placeholder: 'امکانات خاص ملک را وارد کنید', required: false }
        ]
      }
    ]
  },
  'marketing': {
    id: 'marketing',
    title: 'فروش و بازاریابی',
    description: 'دستیارهای هوشمند برای تولید محتوا و تحلیل رقبا',
    icon: '📊',
    agents: [
      {
        id: 'sales-content',
        name: 'تولیدکننده محتوای فروش',
        category: 'فروش و بازاریابی',
        description: 'محتوای فروش حرفه‌ای برای محصولات و خدمات شما',
        icon: '📝',
        fields: [
          { id: 'product_name', label: 'نام محصول یا خدمت', type: 'text', placeholder: 'مثلاً نرم‌افزار مدیریت فروش', required: true },
          { id: 'target_audience', label: 'مخاطب هدف', type: 'text', placeholder: 'مثلاً صاحبان کسب‌وکارهای کوچک', required: true },
          { id: 'problem', label: 'مشکلی که حل می‌کند', type: 'textarea', placeholder: 'توضیح دهید محصول شما چه مشکلی را حل می‌کند', required: true },
          { id: 'features', label: 'ویژگی‌های کلیدی', type: 'textarea', placeholder: 'ویژگی‌های مهم محصول را لیست کنید', required: true },
          { id: 'tone', label: 'لحن محتوا', type: 'select', options: ['حرفه‌ای', 'صمیمی', 'فنی', 'الهام‌بخش'], required: true }
        ]
      },
      {
        id: 'competitor-analyzer',
        name: 'تحلیل‌گر رقبا',
        category: 'فروش و بازاریابی',
        description: 'تحلیل هوشمند رقبا و دریافت راهکارهای رقابتی',
        icon: '🔍',
        fields: [
          { id: 'industry', label: 'صنعت', type: 'text', placeholder: 'مثلاً فناوری اطلاعات', required: true },
          { id: 'competitors', label: 'نام رقبا', type: 'textarea', placeholder: 'نام رقبای اصلی خود را وارد کنید', required: true },
          { id: 'strengths', label: 'نقاط قوت شما', type: 'textarea', placeholder: 'نقاط قوت کسب‌وکار خود را بنویسید', required: true },
          { id: 'weaknesses', label: 'نقاط ضعف شما', type: 'textarea', placeholder: 'نقاط ضعف کسب‌وکار خود را بنویسید', required: true },
          { id: 'goals', label: 'اهداف رقابتی', type: 'textarea', placeholder: 'اهداف خود در رقابت با دیگران را مشخص کنید', required: false }
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