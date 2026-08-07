// src/app/api/categories/[slug]/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../../lib/db'
import { successResponse, errorResponse } from '../../../../lib/utils'

interface Params {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params
  const category = db.getCategoryById(slug)
  
  if (!category) {
    return errorResponse('دسته‌بندی مورد نظر پیدا نشد', 404)
  }
  
  return successResponse(category)
}