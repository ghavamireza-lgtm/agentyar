import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      agents: data ?? [],
    });
  } catch (error) {
    console.error("Get agents error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch agents",
      },
      { status: 500 }
    );
  }
}
