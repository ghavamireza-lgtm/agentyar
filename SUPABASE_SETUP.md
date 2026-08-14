# Supabase Setup Guide - Agentyar

## 📋 مراحل تنظیم Supabase

### 1️⃣ ایجاد Project
1. به [supabase.com](https://supabase.com) بروید
2. **Create a new project** کلیک کنید
3. Project name را تعریف کنید (مثلاً `agentyar`)
4. Password قوی انتخاب کنید
5. Region را انتخاب کنید
6. **Create project** کلیک کنید

### 2️⃣ دریافت کردن کلیدها
1. پس از ایجاد project، به **Settings → API** بروید
2. **Project URL** را کپی کنید → `NEXT_PUBLIC_SUPABASE_URL`
3. **anon (public)** key را کپی کنید → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. این مقادیر را در `.env.local` قرار دهید

### 3️⃣ ایجاد Tables

**خودکار (توصیه شده):**
- **SQL Editor** در Supabase console را باز کنید
- فایل [`supabase/migrations/schema.sql`](./supabase/migrations/schema.sql) را کپی کنید (اگر وجود دارد)
- Paste کنید و **Run** کلیک کنید

**یا دستی:**
```sql
-- Run these SQL statements in Supabase SQL Editor

-- 1. Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. User Agents (subscriptions)
CREATE TABLE user_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  activated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Agent Runs (history)
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  input JSONB,
  output JSONB,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4️⃣ اعمال RLS Policies

**SQL Editor را باز کنید و فایل زیر را اجرا کنید:**

```bash
# یا فایل SQL را کپی کنید:
cat supabase/migrations/setup_rls.sql
```

در **SQL Editor** ماتصال کنید.

### 5️⃣ Seed کردن Agents

**فایل seed agents را اجرا کنید:**
```bash
# SQL Editor میں
cat supabase/migrations/seed_agents.sql
```

### 6️⃣ Enable Email Authentication (Optional)

1. **Authentication → Providers** بروید
2. **Email** و **Password** فعال‌شده باشند
3. اگر نه، **Enable** کلیک کنید

---

## 🔑 Environment Variables

فایل `.env.local` را ایجاد کنید:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ✅ اعتبارسنجی Setup

Terminal میں اجرا کنید:

```bash
npm run dev
```

سپس این مراحل را انجام دهید:

1. به [http://localhost:3000/signup](http://localhost:3000/signup) بروید
2. یک حساب جدید بسازید
3. در Supabase **profiles** table، مطمئن شوید کاربر اضافه شده
4. به [http://localhost:3000/agent-runs](http://localhost:3000/agent-runs) بروید
5. یک agent را run کنید

---

## 🚀 Production Setup

### Firebase/Google Cloud (Alternative)
اگر Supabase استفاده نمی‌کنید، می‌توانید از Firebase استفاده کنید. اما اجازه‌دهید توصیات اصلی را دنبال کنید.

### Deployment
**Vercel:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GROQ_API_KEY
vercel deploy
```

---

## 📚 Useful SQL Queries

```sql
-- View all agents
SELECT * FROM agents WHERE is_active = true;

-- View user subscriptions
SELECT ua.status, a.title 
FROM user_agents ua
JOIN agents a ON ua.agent_id = a.id
WHERE ua.user_id = 'user-id-here';

-- View agent run history
SELECT * FROM agent_runs 
WHERE user_id = 'user-id-here'
ORDER BY created_at DESC
LIMIT 10;

-- Count user agents
SELECT COUNT(*) FROM agents;

-- Check RLS is enabled
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

---

## ⚠️ Troubleshooting

**Q: Authentication not working?**
- اطمینان حاصل کنید `NEXT_PUBLIC_SUPABASE_URL` و key‌ها صحیح هستند
- Supabase console میں **Email** provider فعال است؟

**Q: API returning 403/401?**
- RLS policies صحیح تنظیم شده‌اند؟
- کاربر لاگین کرده است؟

**Q: Groq API not working?**
- `GROQ_API_KEY` تعریف شده است؟
- API key معتبر است؟

---

حالا تمام تنظیمات آماده است! 🎉
