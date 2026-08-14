import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { plan_id } = body;

    if (!plan_id) {
      return NextResponse.json(
        {
          success: false,
          error: "پلن الزامی است",
        },
        { status: 400 }
      );
    }

    const validPlans = ["free", "plus", "professional"];
    if (!validPlans.includes(plan_id)) {
      return NextResponse.json(
        {
          success: false,
          error: "پلن نامعتبر است",
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
          error: "برای انتخاب پلن باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    // Update user selection with plan
    const { error: updateError } = await supabase
      .from("user_selections")
      .update({
        selected_plan_id: plan_id,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "پلن با موفقیت انتخاب شد",
      plan_id,
    });
  } catch (error) {
    console.error("Select plan error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در انتخاب پلن رخ داد",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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
          error: "برای دریافت پلن باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("user_selections")
      .select("selected_plan_id, selected_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      selection: data,
    });
  } catch (error) {
    console.error("Get plan error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در دریافت پلن رخ داد",
      },
      { status: 500 }
    );
  }
}
