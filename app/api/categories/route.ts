// src/app/api/categories/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse } from '../../../lib/utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const withAgents = searchParams.get('withAgents') === 'true'
  
  let categories = db.getCategories()
  
  if (!withAgents) {
    categories = categories.map(({ agents, ...rest }) => rest)
  }
  
  return successResponse(categories)
}