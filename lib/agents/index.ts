// lib/agents/index.ts
type AgentInput = {
  text: string;
};

type AgentOutput = {
  text: string;
};

export async function runAgent(
  slug: string,
  input: AgentInput
): Promise<AgentOutput> {
  switch (slug) {
    case "sales-marketing":
      return runSalesMarketingAgent(input);
    case "real-estate":
      return {
        text: "Agent املاک به‌زودی فعال می‌شود. فعلاً از Agent بازاریابی استفاده کنید.",
      };
    case "social-content":
      return {
        text: "Agent شبکه‌های اجتماعی به‌زودی فعال می‌شود.",
      };
    default:
      throw new Error("این Agent پشتیبانی نمی‌شود");
  }
}

async function runSalesMarketingAgent(input: AgentInput): Promise<AgentOutput> {
  // نسخه موقت بدون LLM — فقط برای تست فلو
  // بعداً اینجا OpenAI/Claude را وصل می‌کنیم

  const text = input.text.trim();

  return {
    text: `✅ تحلیل اولیه بازاریابی

📌 ورودی شما:
${text}

🎯 پیشنهادهای اولیه:
1) یک پیام فروش کوتاه بنویس که روی درد مشتری تمرکز کند.
2) یک کپشن اینستاگرام با CTA واضح آماده کن.
3) یک ایمیل سرد ۳ پاراگرافی برای مخاطب هدف بساز.
4) ۳ ایده کمپین ۷ روزه پیشنهاد بده.

🚀 نسخه بعدی این Agent با مدل AI واقعی همین ساختار را کامل تولید می‌کند.`,
  };
}