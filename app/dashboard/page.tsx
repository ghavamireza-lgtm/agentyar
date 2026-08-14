// app/dashboard/page.tsx
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // چک کردن لاگین بودن کاربر
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // گرفتن پروفایل
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // گرفتن Agentهای فعال کاربر
  const { data: userAgents } = await supabase
    .from("user_agents")
    .select(`
      id,
      status,
      activated_at,
      agent:agents (
        id,
        slug,
        title,
        description,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("activated_at", { ascending: false });

  // گرفتن همه Agentهای موجود (برای پیشنهاد)
  const { data: allAgents } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const name = profile?.name || user.user_metadata?.name || "کاربر";
  const email = profile?.email || user.email;

  // Agentهایی که هنوز فعال نشده‌اند
  const activatedAgentIds = userAgents?.map((ua: any) => ua.agent?.id) || [];
  const availableAgents =
    allAgents?.filter((agent) => !activatedAgentIds.includes(agent.id)) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
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
        {/* کارت پروفایل */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-yellow-400 text-lg font-bold text-white">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{name}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Agentهای فعال</span>
              <span className="font-medium text-slate-800">
                {userAgents?.length || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">تاریخ عضویت</span>
              <span className="font-medium text-slate-800">
                {new Date(user.created_at).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>

        {/* Agentهای فعال کاربر */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Agentهای من
            </h2>
            <Link
              href="/agent-runs"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              تاریخچه ←
            </Link>
          </div>

          {!userAgents || userAgents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <p className="text-sm text-slate-500">
                هنوز هیچ Agentی فعال نکرده‌اید
              </p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                رفتن به فروشگاه ←
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userAgents.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.agent?.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.agent?.category} · فعال از{" "}
                      {new Date(item.activated_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>

                  <div className="mr-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status === "active" ? "فعال" : item.status}
                    </span>

                    <Link
                      href={`/agent/${item.agent?.id}`}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      مدیریت
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agentهای پیشنهادی */}
      {availableAgents.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Agentهای پیشنهادی برای شما
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableAgents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {agent.category}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  {agent.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {agent.description}
                </p>

                <Link
                  href={`/agent/${agent.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  مشاهده و فعال‌سازی
                  <svg
                    className="h-4 w-4 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}