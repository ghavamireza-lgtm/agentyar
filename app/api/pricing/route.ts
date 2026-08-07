// src/app/api/pricing/route.ts
import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse } from '../../../lib/utils'

export async function GET(request: NextRequest) {
  const plans = db.getPricingPlans()
  return successResponse(plans)
}