import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "run ID الزامی است",
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
          error: "برای دریافت جزئیات باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("agent_runs")
      .select(
        `
        id,
        user_id,
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
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "این run پیدا نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      run: data,
    });
  } catch (error) {
    console.error("Get run error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در دریافت جزئیات رخ داد",
      },
      { status: 500 }
    );
  }
}
