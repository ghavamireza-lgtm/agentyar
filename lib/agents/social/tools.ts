import { tool } from 'ai'
import { z } from 'zod'

export const socialTools = {
    generateCaption: tool({
        description: 'تولید کپشن برای پست شبکه‌های اجتماعی',
        inputSchema: z.object({
            platform: z.enum(['instagram', 'telegram', 'linkedin', 'twitter']).describe('پلتفرم مورد نظر'),
            topic: z.string().describe('موضوع پست'),
            tone: z.enum(['رسمی', 'صمیمی', 'فروشی', 'آموزشی', 'طنز']).optional().describe('لحن محتوا'),
            length: z.enum(['کوتاه', 'متوسط', 'بلند']).optional().default('متوسط'),
        }),
        execute: async ({ platform, topic, tone = 'صمیمی', length }) => {
      // فعلاً فقط اطلاعات رو برمی‌گردونیم. بعداً می‌تونیم منطق پیچیده‌تر اضافه کنیم
      return {
        platform,
        topic,
        tone,
        length,
        message: `کپشن برای ${platform} با موضوع "${topic}" و لحن ${tone} آماده شد.`,
      };
    },
  }),

  suggestHashtags: tool({
    description: 'پیشنهاد هشتگ مرتبط و پربازدید',
    inputSchema: z.object({
      topic: z.string().describe('موضوع اصلی'),
      count: z.number().min(5).max(20).default(10),
    }),
    execute: async ({ topic, count }) => {
      return {
        topic,
        count,
        message: `${count} هشتگ مرتبط با "${topic}" پیشنهاد شد.`,
      };
    },
  }),
};