import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category } = body;

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "دسته‌بندی الزامی است",
        },
        { status: 400 }
      );
    }

    const validCategories = ["real-estate", "marketing", "social"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: "دسته‌بندی نامعتبر است",
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
          error: "برای انتخاب دسته‌بندی باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    // Check if user already has a selection
    const { data: existingSelection } = await supabase
      .from("user_selections")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSelection) {
      // Update existing selection
      const { error: updateError } = await supabase
        .from("user_selections")
        .update({
          selected_category: category,
          selected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;
    } else {
      // Insert new selection
      const { error: insertError } = await supabase.from("user_selections").insert({
        user_id: user.id,
        selected_category: category,
        selected_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت انتخاب شد",
      category,
    });
  } catch (error) {
    console.error("Select category error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در انتخاب دسته‌بندی رخ داد",
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
          error: "برای دریافت انتخاب باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("user_selections")
      .select("selected_category, selected_plan_id, selected_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      selection: data,
    });
  } catch (error) {
    console.error("Get selection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در دریافت انتخاب رخ داد",
      },
      { status: 500 }
    );
  }
}
