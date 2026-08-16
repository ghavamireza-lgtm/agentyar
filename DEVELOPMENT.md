# Development Guide - Agentyar

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account
- Groq API key (optional, fallback available)

### Installation

```bash
# Clone and install
git clone <repo>
cd agentyar
npm install

# Setup environment
cp .env.example .env.local

# Fill in your Supabase and Groq credentials
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# GROQ_API_KEY=...
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📁 Project Structure

```
agentyar/
├── app/                    # Next.js App Router
│   ├── agent/[id]/        # Agent detail page
│   ├── agent-runs/        # Agent runs history
│   ├── api/               # API routes
│   │   ├── agents/        # Agent endpoints
│   │   ├── agent-runs/    # History endpoints
│   │   └── auth/          # Authentication
│   ├── category/[slug]/   # Category pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Sign up page
│   └── layout.tsx         # Root layout
│
├── components/
│   └── agents/
│       └── AgentForm.tsx  # Form for running agents
│
├── lib/
│   ├── agents/           # Agent logic
│   └── supabase/         # Supabase clients
│
├── data/
│   └── agents.ts         # Agent definitions
│
├── types/
│   └── index.ts          # TypeScript types
│
├── supabase/
│   └── migrations/       # SQL migrations
│       ├── setup_rls.sql
│       └── seed_agents.sql
│
└── public/               # Static files
```

---

## 🔄 Key Workflows

### 1. User Registration & Login

**Flow:**
1. User fills signup form → `POST /api/auth/signup`
2. Auth creates user + profiles table record
3. User logged in and redirected to dashboard

**Code:**
- [app/signup/page.tsx](./app/signup/page.tsx)
- [app/api/auth/signup/route.ts](./app/api/auth/signup/route.ts)

### 2. Activate Agent

**Flow:**
1. User clicks "فعال کن" button on agent page
2. `POST /api/agents/activate` with agent_id
3. Creates/updates user_agents record
4. Frontend shows success

**Code:**
- [app/agent/[id]/page.tsx](./app/agent/[id]/page.tsx) - Activate button
- [app/api/agents/activate/route.ts](./app/api/agents/activate/route.ts) - API logic

### 3. Run Agent

**Flow:**
1. User fills form and submits
2. `POST /api/agents/run` with agent_id + input
3. API validates auth and activation
4. Calls Groq LLM (or fallback)
5. Saves result to agent_runs table
6. Returns output to frontend

**Code:**
- [components/agents/AgentForm.tsx](./components/agents/AgentForm.tsx) - Form submission
- [app/api/agents/run/route.ts](./app/api/agents/run/route.ts) - Groq integration

### 4. View History

**Flow:**
1. User visits `/agent-runs` or dashboard history
2. `GET /api/agent-runs` fetches runs
3. Displays all runs with input/output

**Code:**
- [app/agent-runs/page.tsx](./app/agent-runs/page.tsx) - History page
- [app/api/agent-runs/route.ts](./app/api/agent-runs/route.ts) - Fetch runs

---

## 🔐 Authentication & RLS

### How it works
- All API routes require `await supabase.auth.getUser()`
- Database has Row Level Security policies
- Users can only access their own data

### RLS Policies
See [supabase/migrations/setup_rls.sql](./supabase/migrations/setup_rls.sql)

### Adding Protected Routes
```typescript
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## 🤖 Groq LLM Integration

### Setup
1. Get API key from [console.groq.com](https://console.groq.com)
2. Add to `.env.local`: `GROQ_API_KEY=...`

### How it works
- `callGroqAgent()` in [app/api/agents/run/route.ts](./app/api/agents/run/route.ts)
- Uses `@ai-sdk/groq` with `llama-3.1-8b-instant` model
- Returns Persian text formatted in 3 sections

### Fallback
If `GROQ_API_KEY` is not set, returns mock response with same format.

### Customizing Prompts
Edit the prompt in `callGroqAgent()`:
```typescript
const prompt = `You are a professional AI assistant for ${agentName}...`
```

---

## 📊 Database Schema

### profiles
```sql
id (uuid) - References auth.users.id
name (text)
email (text)
avatar_url (text)
created_at, updated_at
```

### agents
```sql
id (uuid)
slug (text) - Unique identifier
title (text) - Display name
description (text)
category (text)
is_active (boolean)
created_at, updated_at
```

### user_agents
```sql
id (uuid)
user_id (uuid) → profiles.id
agent_id (uuid) → agents.id
status (text) - 'active' | 'inactive'
activated_at
```

### agent_runs
```sql
id (uuid)
user_id (uuid) → profiles.id
agent_id (uuid) → agents.id
input (jsonb) - User form data
output (jsonb) - AI response
status (text) - 'processing' | 'completed' | 'failed'
error (text)
created_at, completed_at
```

---

## 🧪 Testing API Endpoints

### Using Postman
1. Import [Agentyar_API.postman_collection.json](./Agentyar_API.postman_collection.json)
2. Set `base_url` variable to `http://localhost:3000`
3. Test each endpoint

### Using cURL

```bash
# Get agents list
curl http://localhost:3000/api/agents

# Sign up (create account first)
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"علی","email":"ali@test.com","password":"password123"}'

# Run agent (requires auth - browser cookies)
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"sales-content","input":{"product_name":"محصول"}}'

# Get history
curl http://localhost:3000/api/agent-runs
```

---

## 🛠️ Common Development Tasks

### Add New Agent

1. **Define in [data/agents.ts](./data/agents.ts)**:
```typescript
const myAgent: Agent = {
  id: 'my-agent',
  name: 'نام دستیار',
  category: 'دسته‌بندی',
  description: 'توضیح',
  icon: '📝',
  fields: [
    { id: 'field1', label: 'فیلد 1', type: 'text', required: true },
  ]
}
```

2. **Update [supabase/migrations/seed_agents.sql](./supabase/migrations/seed_agents.sql)**:
```sql
INSERT INTO agents VALUES ('uuid', 'slug', 'نام', '...', 'دسته', true, NOW(), NOW());
```

### Customize Form Fields
Edit agent.fields in data/agents.ts:
- type: 'text' | 'number' | 'textarea' | 'select'
- Add options for select type
- Mark required fields

### Change Groq Model
Edit in [app/api/agents/run/route.ts](./app/api/agents/run/route.ts):
```typescript
model: groq("mixtral-8x7b-32768") // Available models
```

---

## 🐛 Debugging

### Enable Server Logs
```bash
npm run dev  # Logs appear in console
```

### Database Debugging
Open Supabase SQL Editor:
```sql
-- Check user data
SELECT * FROM auth.users;
SELECT * FROM profiles;

-- Check agent runs
SELECT * FROM agent_runs WHERE user_id = 'user-id' ORDER BY created_at DESC;

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'agent_runs';
```

### Frontend Debugging
- Browser DevTools → Network tab → API requests
- Check error messages in response
- Verify auth cookies exist

---

## 📦 Building for Production

```bash
npm run build  # Builds Next.js app
npm start      # Runs production server
```

### Before Deploying
- [ ] All env vars set
- [ ] Supabase RLS policies applied
- [ ] Database migrations run
- [ ] Groq API key working
- [ ] CORS configured if needed

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test: `npm run dev` and `npm run lint`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/my-feature`

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [AI SDK Docs](https://sdk.vercel.ai)

---

Happy coding! 🚀
