import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agents'

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const input = body?.input

    if (!input?.text || typeof input.text !== 'string') {
      return NextResponse.json({ error: 'ورودی متنی الزامی است' }, { status: 400 })
    }

    if (input.text.length > 5000) {
      return NextResponse.json({ error: 'متن ورودی بیش از حد طولانی است' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'لطفاً وارد شوید' }, { status: 401 })
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('id, slug, title')
      .eq('slug', id)
      .eq('is_active', true)
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent پیدا نشد' }, { status: 404 })
    }

    const { data: userAgent } = await supabase
      .from('user_agents')
      .select('id')
      .eq('user_id', user.id)
      .eq('agent_id', agent.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!userAgent) {
      return NextResponse.json({ error: 'ابتدا این Agent را فعال کنید' }, { status: 403 })
    }

    const { data: run, error: insertError } = await supabase
      .from('agent_runs')
      .insert({
        user_id: user.id,
        agent_id: agent.id,
        input,
        status: 'running',
      })
      .select('*')
      .single()

    if (insertError || !run) {
      return NextResponse.json(
        { error: insertError?.message || 'خطا در ایجاد اجرا' },
        { status: 500 }
      )
    }

    try {
      const output = await runAgent(id, input)

      const { data: completedRun } = await supabase
        .from('agent_runs')
        .update({
          output,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', run.id)
        .select('*')
        .single()

      return NextResponse.json({
        output,
        run: completedRun,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای ناشناخته'

      await supabase
        .from('agent_runs')
        .update({
          status: 'failed',
          error: message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', run.id)

      return NextResponse.json({ error: message || 'اجرای Agent ناموفق بود' }, { status: 500 })
    }
  } catch (err) {
    console.error('Run error:', err)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
