// src/app/api/agents/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse } from '../../../lib/utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  
  let agents = db.getAgents()
  
  if (category) {
    agents = agents.filter(a => a.category === category)
  }
  
  return successResponse(agents)
}