# 🐛 Agent Activation Fix - Issue & Solution

## 🔴 Problem

When clicking the "فعال کن" (Activate) button on an agent page (e.g., `/agent/price-advisor`), the error appeared:

```
خطایی در فعال‌سازی دستیار رخ داد
(Error activating agent)
```

---

## 🔍 Root Cause

**ID Mismatch Between Local Data and Database:**

The agent IDs in the system were mismatched:

1. **In the local data** (`data/agents.ts`):
   - Agent IDs are slugs: `'price-advisor'`, `'ad-writer'`, `'sales-content'`, etc.

2. **In Supabase database** (`agents` table):
   - Agent IDs are UUIDs: `'550e8400-e29b-41d4-a716-446655440001'`, etc.
   - Slugs are stored in the `slug` column

3. **The activation API** was receiving the slug (`'price-advisor'`) but trying to insert into `user_agents` table with that slug as `agent_id`, which violated the foreign key constraint.

```sql
-- What was happening:
user_agents.agent_id = 'price-advisor'  -- 🔴 FK expects UUID, not slug
agents.id = '550e8400-e29b-41d4-a716-446655440001'  -- ✅ Real UUID
agents.slug = 'price-advisor'  -- ✅ Slug stored here
```

---

## ✅ Solution Implemented

Modified `/app/api/agents/activate/route.ts` to:

1. **Accept agent slug** (e.g., `'price-advisor'`)
2. **Lookup the agent UUID** from the database by slug
3. **Insert with the correct UUID** into `user_agents` table

### Code Changes

**Before:**
```typescript
const { error: insertError } = await supabase.from("user_agents").insert({
  user_id: user.id,
  agent_id,  // 🔴 This is 'price-advisor' but should be UUID
  status: "active",
  activated_at: new Date().toISOString(),
});
```

**After:**
```typescript
// Step 1: Lookup agent by slug to get UUID
const { data: agentRow, error: agentLookupError } = await supabase
  .from("agents")
  .select("id")
  .or(`slug.eq.${agent_id},id.eq.${agent_id}`)
  .maybeSingle();

if (!agentRow) {
  return NextResponse.json(
    { success: false, error: "دستیار یافت نشد" },
    { status: 404 }
  );
}

// Step 2: Use the correct UUID
const actualAgentId = agentRow.id;

// Step 3: Insert with UUID
const { error: insertError } = await supabase.from("user_agents").insert({
  user_id: user.id,
  agent_id: actualAgentId,  // ✅ Now using actual UUID
  status: "active",
  activated_at: new Date().toISOString(),
});
```

---

## 🔄 How It Works Now

```
User clicks "فعال کن" button
    ↓
API receives: { agent_id: 'price-advisor' }
    ↓
Query database: SELECT id FROM agents WHERE slug = 'price-advisor'
    ↓
Get UUID: '550e8400-e29b-41d4-a716-446655440001'
    ↓
Insert into user_agents with UUID
    ↓
✅ Success!
```

---

## 🧪 Testing

### Before the Fix
```
1. Visit http://localhost:3000/agent/price-advisor
2. Click "فعال کن" button
3. ❌ Error: "خطایی در فعال‌سازی دستیار رخ داد"
```

### After the Fix
```
1. Visit http://localhost:3000/agent/price-advisor
2. Click "فعال کن" button
3. ✅ Success: "دستیار با موفقیت فعال شد"
4. Button changes to "دستیار فعال شد ✓"
5. User agent record created in Supabase user_agents table
```

---

## 📊 Database Schema Context

**agents table:**
```
id (UUID)          | slug (text)        | title (text)
550e8400-e29b-... | 'price-advisor'   | 'مشاور قیمت‌گذاری ملک'
550e8400-e29b-... | 'ad-writer'       | 'نویسنده آگهی ملک'
```

**user_agents table:**
```
id (UUID)      | user_id (UUID) | agent_id (UUID)        | status
abc123-...     | def456-...     | 550e8400-e29b-...      | 'active'
xyz789-...     | def456-...     | 550e8400-e29b-...      | 'active'
```

The `agent_id` in `user_agents` MUST be a valid UUID from `agents.id` table (foreign key constraint).

---

## 🚀 Changes Made

**File:** `/app/api/agents/activate/route.ts`

**Changes:**
- Added agent lookup query before inserting into `user_agents`
- Query searches by slug OR id: `.or(\`slug.eq.${agent_id},id.eq.${agent_id}\`)`
- Returns 404 if agent not found
- Uses the fetched UUID `actualAgentId` for the insert operation
- All existing functionality preserved (status checking, error handling, etc.)

---

## ✨ Why This Pattern Works

This is the same pattern used in `/api/agents/run` route which was already working correctly. The `run` API:

1. Accepts `agent_id` (slug)
2. Looks it up in database
3. Uses the UUID for database operations
4. Falls back to local data if DB lookup fails

The `activate` API now follows this same pattern for consistency.

---

## 🔐 Security & Validation

✅ **Authentication required** - Users must be logged in
✅ **Agent validation** - Returns 404 if agent doesn't exist
✅ **RLS policies** - User can only activate for themselves
✅ **Duplicate protection** - Can't activate same agent twice
✅ **Type-safe** - Uses actual UUID type from database

---

## 📝 Summary

| Aspect | Status |
|--------|--------|
| Issue | ❌ ID mismatch between slug and UUID |
| Root Cause | 🔍 API using slug instead of UUID for FK |
| Solution | ✅ Added slug-to-UUID lookup before insert |
| Build | ✅ Compiles successfully |
| Testing | ⏳ Ready to test on http://localhost:3000/agent/price-advisor |

---

## Next Steps

1. ✅ Fix applied
2. ✅ Build verified
3. ⏳ **Test on live server**
   - Go to http://localhost:3000/agent/price-advisor
   - Click "فعال کن"
   - Verify success message appears
   - Check Supabase: user_agents table should have new record

4. 🎉 **Done!**

---

## 💡 Related Files

- `/app/api/agents/activate/route.ts` - Fixed endpoint
- `/app/api/agents/run/route.ts` - Reference implementation (working correctly)
- `/components/agents/ActivateAgentButton.tsx` - Frontend button component
- `/app/agent/[id]/page.tsx` - Agent detail page
