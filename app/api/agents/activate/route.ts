import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { activateUserAgent, getAgentBySlug } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'slug الزامی است.' },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'برای فعال‌سازی باید وارد حساب شوید.' },
        { status: 401 },
      )
    }

    const agent = await getAgentBySlug(slug)

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'دستیار یافت نشد.' },
        { status: 404 },
      )
    }

    const userAgent = await activateUserAgent(user.id, agent.id)

    return NextResponse.json({
      success: true,
      already_active: false,
      message: 'دستیار با موفقیت فعال شد.',
      agent_id: agent.id,
      user_agent_id: userAgent.id,
    })
  } catch (error) {
    console.error('Activate agent error:', error)

    return NextResponse.json(
      { success: false, error: 'خطایی در فعال‌سازی دستیار رخ داد.' },
      { status: 500 },
    )
  }
}
