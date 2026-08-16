import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import type { Agent } from '@/types'

const model = groq('llama-3.3-70b-versatile')

function formatInput(input: Record<string, unknown>) {
  return Object.entries(input)
    .map(([key, value]) => `${key}: ${String(value ?? '').trim()}`)
    .filter((line) => line.split(': ').slice(1).join(': ').trim())
    .join('\n')
}

function buildSystemPrompt(agent: Agent) {
  const fields = agent.fields
    .map((field) => `- ${field.label} (${field.id})`)
    .join('\n')

  return `
تو دستیار هوشمند «${agent.name}» در پلتفرم ایجنت‌یار هستی.

حوزه: ${agent.category}
توضیح: ${agent.description}

فیلدهای ورودی این دستیار:
${fields || '- ورودی آزاد'}

قوانین:
- پاسخ را به فارسی روان و طبیعی بده.
- دقیقاً بر اساس اطلاعات کاربر پاسخ بده و اطلاعات ساختگی را به عنوان واقعیت مطرح نکن.
- اگر داده‌ای برای نتیجه‌گیری کافی نیست، کمبود اطلاعات را واضح بگو و در صورت امکان فرض‌ها را جداگانه مشخص کن.
- پاسخ را کاربردی، ساختاریافته و قابل استفاده ارائه کن.
- از مقدمه‌های طولانی و کلی‌گویی خودداری کن.
`
}

export async function runAgent(
  agent: Agent,
  input: Record<string, unknown>,
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY تنظیم نشده است.')
  }

  const inputText = formatInput(input)

  if (!inputText) {
    throw new Error('حداقل یک ورودی معتبر لازم است.')
  }

  const result = await generateText({
    model,
    system: buildSystemPrompt(agent),
    prompt: `اطلاعات کاربر:\n${inputText}\n\nلطفاً وظیفه این دستیار را انجام بده و نتیجه نهایی را ارائه کن.`,
  })

  return {
    text: result.text,
  }
}
