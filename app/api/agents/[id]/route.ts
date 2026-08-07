// src/app/api/agents/[id]/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../../lib/db'
import { successResponse, errorResponse } from '../../../../lib/utils'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  const agent = db.getAgentById(id)
  
  if (!agent) {
    return errorResponse('دستیار مورد نظر پیدا نشد', 404)
  }
  
  return successResponse(agent)
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params
  const agent = db.getAgentById(id)
  
  if (!agent) {
    return errorResponse('دستیار مورد نظر پیدا نشد', 404)
  }
  
  const body = await request.json()
  
  // اعتبارسنجی فیلدهای اجباری
  const requiredFields = agent.fields
    .filter(f => f.required)
    .map(f => f.id)
  
  for (const field of requiredFields) {
    if (!body[field] || body[field].toString().trim() === '') {
      return errorResponse(`فیلد ${field} اجباری است`)
    }
  }
  
  // ذخیره در دیتابیس
  const submission = db.createSubmission({
    agentId: id,
    data: body
  })
  
  // شبیه‌سازی پردازش هوش مصنوعی
  const result = generateAIResponse(id, body)
  
  return successResponse({
    submission,
    result
  }, 'درخواست شما با موفقیت پردازش شد')
}

// تابع شبیه‌سازی پاسخ هوش مصنوعی
function generateAIResponse(agentId: string, data: any) {
  const responses: Record<string, string> = {
    'price-advisor': `بر اساس اطلاعات وارد شده:
- مساحت: ${data.area} متر مربع
- تعداد اتاق: ${data.bedrooms}
- سن بنا: ${data.age} سال
- محله: ${data.location}

قیمت پیشنهادی: ${Math.floor(Math.random() * 500 + 100)} میلیون تومان

توصیه: با توجه به موقعیت مکانی و امکانات، این ملک پتانسیل افزایش قیمت دارد.`,
    
    'ad-writer': `🏠 آگهی ویژه ملک

${data.property_type} ${data.area} متری با ${data.bedrooms} اتاق خواب در ${data.location}

✨ ویژگی‌های خاص:
${data.features || 'دارای امکانات کامل'}

💰 قیمت: ${data.price} تومان

برای بازدید و اطلاعات بیشتر تماس بگیرید.`,
    
    'sales-content': `💡 محتوای فروش حرفه‌ای

محصول: ${data.product_name}
مخاطب هدف: ${data.target_audience}

مشکلی که حل می‌کند:
${data.problem}

ویژگی‌های کلیدی:
${data.features}

با لحن ${data.tone}، این محتوا برای جذب مشتریان ایده‌آل است.`,
    
    'competitor-analyzer': `🔍 تحلیل رقبا

صنعت: ${data.industry}
رقبا: ${data.competitors}

نقاط قوت شما:
${data.strengths}

نقاط ضعف شما:
${data.weaknesses}

${data.goals ? `اهداف رقابتی:\n${data.goals}` : ''}

پیشنهاد استراتژیک: بر روی نقاط قوت خود تمرکز کنید و از فرصت‌های موجود در بازار استفاده کنید.`
  }
  
  return {
    content: responses[agentId] || 'پاسخ شما آماده شده است. به زودی قابلیت نمایش خروجی کامل اضافه خواهد شد.',
    timestamp: new Date().toISOString()
  }
}