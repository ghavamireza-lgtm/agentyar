// app/api/agents/[slug]/activate/route.ts
import { createClient } from "../../../../lib/supabase/server";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agent پیدا نشد" }, { status: 404 });
  }

  const { error } = await supabase.from("user_agents").upsert(
    {
      user_id: user.id,
      agent_id: agent.id,
      status: "active",
    },
    { onConflict: "user_id,agent_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL(`/agents/${slug}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  );
}