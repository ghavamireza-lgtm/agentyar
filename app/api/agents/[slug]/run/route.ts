import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  activateUserAgent,
  completeAgentRun,
  createAgentRun,
  failAgentRun,
  getAgentBySlug,
} from '@/lib/db'
import { runAgent } from '@/lib/agents'

const bodySchema = z.object({
  input: z.record(z.string(), z.unknown()),
})

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function POST(request: Request, { params }: RouteContext) {
  let runId: string | null = null

  try {
    const { slug } = await params
    const body = await request.json().catch(() => null)
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'اطلاعات ورودی نامعتبر است.' },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'برای اجرای Agent ابتدا وارد حساب شوید.' },
        { status: 401 },
      )
    }

    const agent = await getAgentBySlug(slug)

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent موردنظر پیدا نشد.' },
        { status: 404 },
      )
    }

    const missingFields = agent.fields
      .filter((field) => field.required)
      .filter((field) => {
        const value = parsed.data.input[field.id]
        return value === undefined || value === null || String(value).trim() === ''
      })
      .map((field) => field.label)

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `لطفاً این موارد را تکمیل کنید: ${missingFields.join('، ')}`,
        },
        { status: 400 },
      )
    }

    await activateUserAgent(user.id, agent.id)

    const run = await createAgentRun(user.id, agent.id, parsed.data.input)
    runId = run.id

    try {
      const result = await runAgent(agent, parsed.data.input)
      const savedRun = await completeAgentRun(run.id, { text: result.text })

      return NextResponse.json({
        success: true,
        runId: savedRun.id,
        output: result.text,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'اجرای Agent ناموفق بود.'

      await failAgentRun(run.id, message)

      return NextResponse.json(
        { success: false, error: 'اجرای Agent ناموفق بود.' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Agent run error:', { runId, error })

    return NextResponse.json(
      { success: false, error: 'خطایی در سرور رخ داد.' },
      { status: 500 },
    )
  }
}
