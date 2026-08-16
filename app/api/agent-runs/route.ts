import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "برای دریافت تاریخچه باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("agent_runs")
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      runs: data ?? [],
    });
  } catch (error) {
    console.error("Get runs error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در دریافت تاریخچه رخ داد",
      },
      { status: 500 }
    );
  }
}
