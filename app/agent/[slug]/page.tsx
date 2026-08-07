// app/agents/[slug]/page.tsx
import { createClient } from "../../../lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import AgentRunner from "../../agent/[slug]/AgentRunner";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // گرفتن Agent
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!agent) {
    notFound();
  }

  // چک فعال بودن برای این کاربر
  const { data: userAgent } = await supabase
    .from("user_agents")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("agent_id", agent.id)
    .maybeSingle();

  const isActivated = !!userAgent && userAgent.status === "active";

  // آخرین اجراها
  const { data: recentRuns } = await supabase
    .from("agent_runs")
    .select("id, input, output, status, created_at, error")
    .eq("user_id", user.id)
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← بازگشت به داشبورد
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {agent.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{agent.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {agent.description}
            </p>
          </div>

          <div>
            {isActivated ? (
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                فعال است
              </span>
            ) : (
              <form action={`/api/agents/${slug}/activate`} method="post">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-l from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600"
                >
                  فعال‌سازی Agent
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {isActivated ? (
        <AgentRunner slug={slug} recentRuns={recentRuns || []} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p className="text-sm text-slate-600">
            برای استفاده از این Agent، ابتدا آن را فعال کنید.
          </p>
        </div>
      )}
    </div>
  );
}