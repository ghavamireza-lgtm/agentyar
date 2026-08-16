# 🚀 Agentyar - Platform کامل AI Agents

Agentyar یک پلتفرم وب تکاملی است که کاربران را قادر می‌سازد تا از دستیارهای هوشمند تخصصی در حوزه‌های مختلف (املاک، بازاریابی، شبکه‌های اجتماعی) استفاده کنند.

---

## ✨ ویژگی‌های اصلی

✅ **سیستم احراز هویت کامل**
- ثبت‌نام و ورود
- Supabase Authentication
- حفاظت جلسات

✅ **فروشگاه دستیارها**
- دسته‌بندی شده
- توضیحات جزئی
- فعال‌سازی توسط کاربر

✅ **اجرای Agents**
- فرم‌های پویا
- Integration با Groq LLM
- ذخیره‌سازی نتایج

✅ **تاریخچه کامل**
- دیدن تمام درخواست‌ها
- مشاهده ورودی و خروجی
- جستجو و فیلترینگ

✅ **داشبورد کاربری**
- مدیریت agents فعال
- پروفایل
- آمار استفاده

---

## 🎯 نمای کلی فنی

### معماری
```
Frontend (Next.js 16 + React 19 + Tailwind)
         ↓
API Routes (Server-side rendering)
         ↓
Supabase (PostgreSQL + Auth + RLS)
         ↓
Groq LLM (AI Processing)
```

### Routes و Endpoints

#### Pages
- `/` - صفحه اصلی
- `/signup` - ثبت‌نام
- `/login` - ورود
- `/dashboard` - داشبورد کاربر
- `/category/[slug]` - دسته‌بندی
- `/agent/[id]` - صفحه دستیار
- `/agent-runs` - تاریخچه

#### API Endpoints
| متد | Endpoint | توضیح |
|-----|----------|--------|
| POST | `/api/auth/signup` | ثبت‌نام کاربر جدید |
| POST | `/api/auth/login` | ورود کاربر |
| POST | `/api/auth/logout` | خروج |
| GET | `/api/agents` | لیست agents فعال |
| POST | `/api/agents/run` | اجرای یک agent |
| POST | `/api/agents/activate` | فعال‌سازی agent |
| GET | `/api/agent-runs` | تاریخچه اجراها |
| GET | `/api/agent-runs/[id]` | جزئیات یک اجرا |

---

## 🚀 راه اندازی سریع

### 1. نیازمندی‌ها
```bash
Node.js 18+
npm/yarn
Supabase account (supabase.com)
Groq API key (console.groq.com) - اختیاری
```

### 2. نصب و تنظیم

```bash
# Clone repository
git clone <repo>
cd agentyar

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Supabase Setup

[📘 دانلود راهنمای کامل Supabase](./SUPABASE_SETUP.md)

خلاصه مراحل:
1. پروژه جدید ایجاد کنید
2. URL و API keys را کپی کنید
3. SQL migrations را اجرا کنید
4. RLS policies را enable کنید
5. Agents نمونه را seed کنید

### 4. اجرا

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

سرور در `http://localhost:3000` فعال می‌شود.

---

## 📊 ساختار Database

### 4 جدول اصلی:

**profiles**
- User profiles و metadata

**agents**
- تعریف تمام dستیارها

**user_agents**
- سابسکریپشن‌های کاربر

**agent_runs**
- تاریخچه اجراها و نتایج

[📘 Schema مکمل](./SUPABASE_SETUP.md#3️⃣-ایجاد-tables)

---

## 🤖 Groq LLM Integration

### Setup
```env
GROQ_API_KEY=your_key_here
```

### Fallback
اگر API key موجود نباشد، سیستم خودکار fallback text برمی‌گرداند.

### Models Available
- llama-3.1-8b-instant (پیش‌فرض)
- mixtral-8x7b-32768
- gemma-7b-it

[تغییر model در کد](./app/api/agents/run/route.ts#L42)

---

## 🧪 Testing

### Postman Collection

[📥 دانلود Postman Collection](./Agentyar_API.postman_collection.json)

```bash
# Import into Postman
# Set base_url = http://localhost:3000
# Test each endpoint
```

### Quick cURL Tests

```bash
# Get agents
curl http://localhost:3000/api/agents

# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Run agent
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"sales-content","input":{"product_name":"Product"}}'
```

---

## 📁 فایل‌های مهم

| فایل | توضیح |
|------|--------|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | راهنمای تنظیم Supabase |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | راهنمای توسعه |
| [.env.example](./.env.example) | نمونه متغیرهای محیطی |
| [supabase/migrations/](./supabase/migrations/) | SQL migrations |
| [Agentyar_API.postman_collection.json](./Agentyar_API.postman_collection.json) | Postman collection |

---

## 🔐 Security

✅ **Row Level Security (RLS)**
- هر کاربر فقط داده‌های خود را می‌بیند
- Policies برای هر table

✅ **Authentication**
- Supabase auth
- Session management
- Protected API routes

✅ **Input Validation**
- Form validation
- API validation
- Type safety

[📘 بیشتر درباره Security](./DEVELOPMENT.md#-authentication--rls)

---

## 🚢 Deployment

### Vercel (توصیه شده)

```bash
# Connect repo to Vercel
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GROQ_API_KEY

# Deploy
vercel deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

---

## 📈 Performance

- ✅ Static generation برای pages
- ✅ API caching
- ✅ Database indexes
- ✅ Optimized queries

---

## 🤝 Contributing

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev
npm run lint

# Commit
git commit -m "feat: description"

# Push
git push origin feature/my-feature
```

---

## 📚 More Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Groq API Reference](https://console.groq.com/docs)
- [AI SDK (Vercel)](https://sdk.vercel.ai)

---

## ❓ FAQ

**Q: آیا بدون Groq کار می‌کند?**
بله! Fallback text با همان فرمت فراهم می‌شود.

**Q: چطور agents جدید اضافه کنم?**
[مراجعه به DEVELOPMENT.md](./DEVELOPMENT.md#-add-new-agent)

**Q: چطور RLS اصلاح کنم؟**
SQL migrations در `supabase/migrations/setup_rls.sql`

**Q: محدودیت درخواست چند است؟**
Groq: 30 درخواست/دقیقه (free tier)

---

## 📝 License

MIT License

---

## 🎉 Ready to Launch!

```bash
npm run dev
# Visit http://localhost:3000
```

نظرات و پیشنهادات خوش‌آمد! 🚀
