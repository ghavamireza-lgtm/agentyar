// src/app/api/submissions/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse } from '../../../lib/utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const agentId = searchParams.get('agentId')
  
  let submissions = db.getSubmissions()
  
  if (agentId) {
    submissions = submissions.filter(s => s.agentId === agentId)
  }
  
  return successResponse(submissions)
}