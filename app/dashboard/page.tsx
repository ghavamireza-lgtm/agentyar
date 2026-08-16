import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAgents, getUserAgentRuns, getUserAgents } from '@/lib/db'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, userAgents, allAgents, runs] = await Promise.all([
    supabase
      .from('profiles')
      .select('name, email')
      .eq('id', user.id)
      .maybeSingle(),
    getUserAgents(user.id),
    getAgents(),
    getUserAgentRuns(user.id, 8),
  ])

  const activatedAgentIds = new Set(userAgents.map((item) => item.agentId))
  const availableAgents = allAgents.filter(
    (agent) => !activatedAgentIds.has(agent.id),
  )

  const name = profile?.name || user.user_metadata?.name || 'کاربر'
  const email = profile?.email || user.email || ''

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">داشبورد</h1>
          <p className="mt-1 text-sm text-slate-600">
            خوش آمدید، <span className="font-medium text-slate-800">{name}</span>
          </p>
        </div>

        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            خروج از حساب
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-yellow-400 text-lg font-bold text-white">
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{name}</p>
              <p className="truncate text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Agentهای فعال</span>
              <span className="font-medium text-slate-800">{userAgents.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">تعداد اجراهای اخیر</span>
              <span className="font-medium text-slate-800">{runs.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Agentهای من</h2>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              مشاهده همه
            </Link>
          </div>

          {userAgents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <p className="text-sm text-slate-500">هنوز هیچ Agentی فعال نکرده‌اید.</p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                انتخاب اولین Agent ←
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userAgents.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.agent.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.agent.category} · فعال از{' '}
                      {new Date(item.activatedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>

                  <Link
                    href={`/agent/${item.agent.slug}`}
                    className="mr-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    اجرا
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {runs.length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-900">آخرین اجراها</h2>

          <div className="space-y-3">
            {runs.map((run) => {
              const agent = allAgents.find((item) => item.id === run.agentId)

              return (
                <div
                  key={run.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {agent?.name ?? 'Agent'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(run.createdAt).toLocaleString('fa-IR')}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      run.status === 'completed'
                        ? 'bg-green-50 text-green-700'
                        : run.status === 'running'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {run.status === 'completed'
                      ? 'موفق'
                      : run.status === 'running'
                        ? 'در حال اجرا'
                        : 'ناموفق'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {availableAgents.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Agentهای پیشنهادی
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableAgents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{agent.icon}</div>
                <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {agent.description}
                </p>
                <Link
                  href={`/agent/${agent.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  مشاهده و اجرا ←
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
