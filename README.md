# AgentLine

پلتفرم دستیارهای هوش مصنوعی فارسی با Next.js، Supabase و AI SDK.

## معماری فعلی

```text
Landing
  ↓
Category (agents from Supabase)
  ↓
Agent (loaded by slug from Supabase)
  ↓
Form
  ↓
POST /api/agents/[slug]/run
  ↓
Supabase Auth
  ↓
agents
  ↓
user_agents
  ↓
agent_runs = running
  ↓
AI Agent Runner (Groq)
  ↓
agent_runs = completed / failed
  ↓
Result
  ↓
Dashboard / History
```

### Source of truth

- `agents` در Supabase منبع اصلی Agentهاست.
- `user_agents` Agentهای فعال‌شده توسط هر کاربر را نگه می‌دارد.
- `agent_runs` تاریخچه اجرای Agentها و نتیجه آن‌هاست.
- `data/categories.ts` فقط metadata ثابت دسته‌بندی‌هاست؛ Agentهای داخل دسته از DB خوانده می‌شوند.
- `data/pricing.ts` فعلاً تعرفه‌ها را نگه می‌دارد چون جدول pricing در schema فعلی وجود ندارد.

## متغیرهای محیطی

فایل `.env.local` را بساز:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GROQ_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## اجرای پروژه

```bash
npm install
npm run dev
```

برای production:

```bash
npm run build
npm start
```

## دیتابیس و RLS

فایل `supabase/001_rls_and_constraints.sql` را در Supabase SQL Editor اجرا کن.

این migration:

- `agents.slug` را unique می‌کند.
- ترکیب `user_id + agent_id` در `user_agents` را unique می‌کند.
- RLS را برای `agents`, `profiles`, `user_agents`, `agent_runs` فعال می‌کند.
- Agentهای فعال را برای بازدیدکنندگان قابل خواندن می‌کند.
- هر کاربر را فقط به داده‌های خودش محدود می‌کند.

## نکته درباره `is_active`

Schema ارسالی شما ستون Agent را به شکل `is_active` نشان می‌دهد. کد فعلی هم دقیقاً از همین نام استفاده می‌کند.

اگر نام واقعی ستون در PostgreSQL `is_active` است، باید همه queryهای مربوط به آن تغییر کند.

## Flow احراز هویت

اگر کاربر بدون ورود روی اجرای Agent کلیک کند:

```text
Agent
 ↓
401
 ↓
/login?next=/agent/<slug>
 ↓
Login
 ↓
بازگشت به همان Agent
```

پس کاربر بعد از Login دوباره از اول دنبال Agent نمی‌گردد.

## نکته مهم

برای اجرای واقعی Agent باید `GROQ_API_KEY` تنظیم شده باشد.

Runner فعلی generic است و اطلاعات Agent را از جدول `agents` می‌گیرد؛ بنابراین اضافه کردن Agent جدید با تغییر دیتابیس ممکن است بدون ساختن route جدید انجام شود.

Agentهای تخصصی آینده می‌توانند در `lib/agents/` به عنوان tool/runner اختصاصی اضافه شوند.
