"use client";

import { useState } from "react";

type Run = {
  id: string;
  input: any;
  output: any;
  status: string;
  created_at: string;
  error?: string | null;
};

export default function AgentRunner({
  slug,
  recentRuns,
}: {
  slug: string;
  recentRuns: Run[];
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [runs, setRuns] = useState(recentRuns);

  const handleRun = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/agents/${slug}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: {
            text: input,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در اجرای Agent");
        return;
      }

      setResult(data.output);
      setRuns((prev) => [data.run, ...prev].slice(0, 5));
      setInput("");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* فرم اجرا */}
      <form
        onSubmit={handleRun}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          اجرای Agent
        </h2>

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          ورودی شما
        </label>
        <textarea
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={
            slug === "sales-marketing"
              ? "محصول/خدمت خود را معرفی کنید و بگویید مخاطب هدف کیست..."
              : "متن یا توضیحات خود را وارد کنید..."
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="mt-4 rounded-xl bg-gradient-to-l from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 disabled:opacity-60"
        >
          {loading ? "در حال اجرا..." : "اجرا کن"}
        </button>
      </form>

      {/* نتیجه */}
      {result && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-900">نتیجه</h3>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {typeof result === "string"
              ? result
              : result.text || JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* تاریخچه */}
      {runs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            آخرین اجراها
          </h3>
          <div className="space-y-3">
            {runs.map((run) => (
              <div
                key={run.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {new Date(run.created_at).toLocaleString("fa-IR")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      run.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : run.status === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-slate-700">
                  {run.input?.text || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}