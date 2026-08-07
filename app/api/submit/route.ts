// src/app/api/submit/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse, errorResponse, validateRequiredFields } from '../../../lib/utils'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { agentId, data } = body
  
  if (!agentId) {
    return errorResponse('شناسه دستیار اجباری است')
  }
  
  const agent = db.getAgentById(agentId)
  if (!agent) {
    return errorResponse('دستیار مورد نظر پیدا نشد', 404)
  }
  
  if (!data || typeof data !== 'object') {
    return errorResponse('داده‌های ورودی نامعتبر است')
  }
  
  // اعتبارسنجی فیلدهای اجباری
  const requiredFields = agent.fields
    .filter(f => f.required)
    .map(f => f.id)
  
  const validationError = validateRequiredFields(data, requiredFields)
  if (validationError) {
    return errorResponse(validationError)
  }
  
  // ذخیره در دیتابیس
  const submission = db.createSubmission({
    agentId,
    data
  })
  
  return successResponse({
    submission,
    message: 'درخواست شما با موفقیت ثبت شد'
  })
}