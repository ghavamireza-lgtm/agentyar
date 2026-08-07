// src/lib/utils.ts
import type { NextResponse } from 'next/server'

export function successResponse<T>(data: T, message?: string): Response {
  return Response.json({
    success: true,
    data,
    message: message || 'عملیات با موفقیت انجام شد'
  })
}

export function errorResponse(message: string, status: number = 400): Response {
  return Response.json({
    success: false,
    error: message
  }, { status })
}

export function validateRequiredFields(data: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return `فیلد ${field} اجباری است`
    }
  }
  return null
}