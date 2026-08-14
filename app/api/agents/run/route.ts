import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getAgentById, categories } from "@/data/agents";

function normalizeAgentInput(input: unknown): Record<string, unknown> {
  if (!input) return {};
  if (typeof input === "string") {
    try {
      return JSON.parse(input) as Record<string, unknown>;
    } catch {
      return { text: input };
    }
  }

  if (typeof input === "object") {
    return input as Record<string, unknown>;
  }

  return { value: input };
}

function buildFallbackOutput(agentName: string, input: Record<string, unknown>) {
  const lines = Object.entries(input)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `- ${key}: ${String(value)}`)
    .join("\n");

  return `✅ ${agentName}\n\nورودی دریافت‌شده:\n${lines || "- اطلاعاتی وارد نشده است."}\n\nپیشنهاد اولیه:\n1) پیام نهایی را کوتاه و نتیجه‌محور بنویس.\n2) برای مخاطب هدف، مزیت اصلی را برجسته کن.\n3) در پایان یک CTA روشن اضافه کن.\n\nدر نسخه کامل AI، این خروجی با مدل Groq به‌صورت حرفه‌ای و شخصی‌سازی‌شده تولید می‌شود.`;
}

async function callGroqAgent(agentName: string, input: Record<string, unknown>) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return buildFallbackOutput(agentName, input);
  }

  try {
    const prompt = `You are a professional AI assistant for ${agentName}.\nUser input: ${JSON.stringify(input, null, 2)}\n\nReturn Persian output only. Format: 3 sections: 1) نتیجه, 2) پیشنهادات عملی, 3) CTA.`;

    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    return result.text.trim() || buildFallbackOutput(agentName, input);
  } catch (error) {
    console.error("Groq generation failed:", error);
    return buildFallbackOutput(agentName, input);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const candidateId = body.agent_id ?? body.agentId ?? body.slug;
    const rawInput = body.input ?? body.data ?? {};

    if (!candidateId) {
      return NextResponse.json(
        {
          success: false,
          error: "agent_id یا slug الزامی است",
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
          error: "برای اجرای دستیار باید وارد حساب خود شوید",
        },
        { status: 401 }
      );
    }

    const normalizedInput = normalizeAgentInput(rawInput);

    const { data: agentRow, error: agentLookupError } = await supabase
      .from("agents")
      .select("*")
      .or(`slug.eq.${candidateId},id.eq.${candidateId}`)
      .maybeSingle();

    const localAgent =
      getAgentById(candidateId) ??
      Object.values(categories)
        .flatMap((category) => category.agents)
        .find((agent) => agent.id === candidateId || agent.name === candidateId);

    const agentRecord = agentRow ?? localAgent;

    if (!agentRecord && agentLookupError) {
      console.error("Agent lookup error:", agentLookupError);
    }

    const { data: activeAgent, error: activationError } = await supabase
      .from("user_agents")
      .select("id")
      .eq("user_id", user.id)
      .eq("agent_id", agentRow?.id ?? candidateId)
      .eq("status", "active")
      .maybeSingle();

    if (activationError) {
      console.error("Activation lookup error:", activationError);
    }

    if (!agentRow && !localAgent) {
      return NextResponse.json(
        {
          success: false,
          error: "دستیار مورد نظر پیدا نشد",
        },
        { status: 404 }
      );
    }

    if (!activeAgent && agentRow) {
      return NextResponse.json(
        {
          success: false,
          error: "این دستیار برای حساب شما فعال نیست",
        },
        { status: 403 }
      );
    }

    const runInsert = {
      user_id: user.id,
      agent_id: agentRow?.id ?? candidateId,
      input: normalizedInput,
      status: "processing",
      created_at: new Date().toISOString(),
    };

    const { data: runRecord, error: insertError } = await supabase
      .from("agent_runs")
      .insert(runInsert)
      .select()
      .single();

    if (insertError || !runRecord) {
      throw insertError ?? new Error("Unable to create agent run record");
    }

    const agentName =
      (typeof agentRecord === "object" && agentRecord && "name" in agentRecord
        ? String((agentRecord as { name?: string }).name)
        : "دستیار") || "دستیار";

    const outputText = await callGroqAgent(agentName, normalizedInput);

    const { error: updateError } = await supabase
      .from("agent_runs")
      .update({
        output: { answer: outputText },
        status: "completed",
        completed_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", runRecord.id);

    if (updateError) {
      console.error("Agent run update error:", updateError);
    }

    return NextResponse.json({
      success: true,
      run_id: runRecord.id,
      agent: agentRecord,
      output: outputText,
    });
  } catch (error) {
    console.error("Run agent error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطایی در اجرای دستیار رخ داد",
      },
      { status: 500 }
    );
  }
}
