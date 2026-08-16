import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface AgentRun {
  id: string
  agent_id: string
  input: Record<string, unknown> | null
  output: Record<string, unknown> | null
  status: string
  error: string | null
  created_at: string
  completed_at: string | null
  agent: {
    id: string
    title: string
    category: string
  } | null
}

export default async function AgentRunsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: runs } = await supabase
    .from('agent_runs')
    .select(
      `
      id,
      agent_id,
      input,
      output,
      status,
      error,
      created_at,
      completed_at,
      agent:agents (
        id,
        title,
        category
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const agentRuns: AgentRun[] = (runs as unknown as AgentRun[]) || []

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getStatusBadge(status: string) {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-50', text: 'text-green-700', label: '✓ تکمیل شد' },
      processing: { bg: 'bg-blue-50', text: 'text-blue-700', label: '⏳ درحال پردازش' },
      failed: { bg: 'bg-red-50', text: 'text-red-700', label: '✕ ناموفق' },
    }

    const style = statusMap[status] || statusMap.completed
    return <span className={`${style.bg} ${style.text} px-2.5 py-1 rounded-full text-xs font-medium`}>{style.label}</span>
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تاریخچه اجراها</h1>
            <p className="text-gray-600 mt-1">تمام درخواست‌های شما از دستیارهای هوش مصنوعی</p>
          </div>

          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
            ← داشبورد
          </Link>
        </div>

        {agentRuns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-gray-600 font-medium mb-2">تاریخچه خالی است</p>
            <p className="text-sm text-gray-500 mb-6">هنوز هیچ درخواستی از دستیارها نکرده‌اید</p>
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              رفتن به فروشگاه
              <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {agentRuns.map((run) => (
              <div key={run.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{run.agent?.title || 'دستیار نامشخص'}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {run.agent?.category} · {formatDate(run.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(run.status)}
                </div>

                {run.error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-700">
                      <strong>خطا:</strong> {run.error}
                    </p>
                  </div>
                )}

                <div className="mb-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">ورودی:</span>
                    <pre className="mt-1 p-2 bg-gray-50 rounded text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(run.input, null, 2)}
                    </pre>
                  </div>
                </div>

                {run.output && (
                  <div className="mb-4 text-sm">
                    <span className="text-gray-500">خروجی:</span>
                    <div className="mt-1 p-3 bg-primary-50 border border-primary-100 rounded text-gray-800 text-right whitespace-pre-wrap text-xs leading-relaxed max-h-48 overflow-y-auto">
                      {typeof run.output === 'object' && run.output !== null && 'answer' in run.output
                        ? String((run.output as { answer?: unknown }).answer)
                        : JSON.stringify(run.output, null, 2)}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">ID: {run.id.slice(0, 8)}...</p>
                  {run.completed_at && (
                    <p className="text-xs text-gray-500">تکمیل: {formatDate(run.completed_at)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
