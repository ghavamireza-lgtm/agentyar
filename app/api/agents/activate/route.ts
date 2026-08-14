import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { agent_id } = body;

    if (!agent_id) {
      return NextResponse.json(
        {
          success: false,
          error: "agent_id الزامی است",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "برای فعال‌سازی دستیار باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    // Lookup agent by slug or ID to get the UUID
    const { data: agentRow, error: agentLookupError } = await supabase
      .from("agents")
      .select("id")
      .or(`slug.eq.${agent_id},id.eq.${agent_id}`)
      .maybeSingle();

    if (agentLookupError) throw agentLookupError;

    if (!agentRow) {
      return NextResponse.json(
        {
          success: false,
          error: "دستیار یافت نشد",
        },
        { status: 404 }
      );
    }

    const actualAgentId = agentRow.id;

    const { data: existingUserAgent } = await supabase
      .from("user_agents")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("agent_id", actualAgentId)
      .maybeSingle();

    if (existingUserAgent) {
      if (existingUserAgent.status === "active") {
        return NextResponse.json({
          success: false,
          error: "این دستیار قبلاً برای شما فعال است",
        });
      }

      const { error: updateError } = await supabase
        .from("user_agents")
        .update({
          status: "active",
          activated_at: new Date().toISOString(),
        })
        .eq("id", existingUserAgent.id);

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        message: "دستیار فعال شد",
      });
    }

    const { error: insertError } = await supabase.from("user_agents").insert({
      user_id: user.id,
      agent_id: actualAgentId,
      status: "active",
      activated_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "دستیار با موفقیت فعال شد",
    });
  } catch (error) {
    console.error("Activate agent error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در فعال‌سازی دستیار رخ داد",
      },
      { status: 500 }
    );
  }
}
