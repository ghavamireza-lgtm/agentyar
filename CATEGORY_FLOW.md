# 🎯 Category Selection & Pricing Plan Flow

## Overview
کاربران می‌توانند ابتدا حوزه فعالیت خود را انتخاب کنند، سپس یک پلن قیمت‌گذاری را برای آن حوزه انتخاب کنند. این انتخاب‌ها در database ثبت می‌شوند.

---

## 🔄 User Flow

```
Homepage (/home)
    ↓
  [شروع کنید button]
    ↓
Category Selection (/select-category)
  - 3 categories shown
  - User selects one
    ↓
[POST /api/user-selections/category]
  - Saves selection to database
    ↓
Pricing Plans (/pricing)
  - Shows user's selected category
  - User selects a plan
    ↓
[POST /api/user-selections/plan]
  - Saves plan selection
    ↓
Category Page (/category/[slug])
  - Browse agents in selected category
  - Can activate and use agents
```

---

## 📁 New Files Created

### Frontend Pages

#### `/select-category/page.tsx` 
**Category Selection Page**
- 3 interactive cards for categories:
  - 🏠 Real Estate (املاک)
  - 📊 Marketing & Sales (فروش و بازاریابی)  
  - 📱 Social Media (شبکه‌های اجتماعی)
- Visual feedback (selection highlight, checkmark)
- Loading states during submission
- Error handling with auth redirect

```typescript
// Key features:
- State management for selectedId
- Async POST to /api/user-selections/category
- Redirect to /pricing on success
- Error messages in UI
```

### API Routes

#### `/api/user-selections/category/route.ts`
**Category Selection API**
- `POST` - Save/update user's category selection
  - Validates category is one of 3 valid values
  - Creates or updates user_selections record
  - Returns success/error
  
- `GET` - Retrieve user's current selection
  - Returns selected_category and selected_plan_id
  - Requires authentication

#### `/api/user-selections/plan/route.ts`
**Pricing Plan Selection API**
- `POST` - Save user's plan selection
  - Validates plan_id is valid (free, plus, professional)
  - Updates user_selections record with plan
  - Returns success message
  
- `GET` - Retrieve user's current plan
  - Returns selected_plan_id
  - Requires authentication

### Database

#### Migration: `supabase/migrations/add_user_selections.sql`
**New table: `user_selections`**
```sql
CREATE TABLE user_selections (
  id UUID PRIMARY KEY
  user_id UUID (FK to profiles)
  selected_category TEXT ('real-estate', 'marketing', 'social')
  selected_plan_id TEXT ('free', 'plus', 'professional')
  selected_at TIMESTAMP
  created_at TIMESTAMP
  updated_at TIMESTAMP
  UNIQUE(user_id)
)
```

**RLS Policies:**
- Users can view own selections
- Users can insert/update own selections

**Indexes:**
- user_id (for lookups)
- category (for analytics)

---

## 📝 Updated Files

### Pages

#### `/pricing/page.tsx` 
**Enhanced Pricing Page**

**Before:** Static page with links to category
**After:** 
- Client-side component (use client)
- Fetches user's selected category on mount
- Shows category name in header
- Plan selection calls `/api/user-selections/plan`
- Shows loading/selected state on buttons
- Redirects to category page after selection

**Key Changes:**
```typescript
- useState for selectedCategory, selectedPlan
- useEffect to fetch user's selection
- handleSelectPlan() function
- Conditional rendering based on selection state
- Better error handling
```

#### `/app/page.tsx`
**Homepage Update**
- Changed "شروع کنید" button from `/category/real-estate` to `/select-category`
- Users now start category selection flow instead of going directly to a category

---

## 🔐 Security & Validation

### Authentication
All endpoints require:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) return 401 Unauthorized
```

### Validation
- Category: must be one of ['real-estate', 'marketing', 'social']
- Plan: must be one of ['free', 'plus', 'professional']
- Database enforces UNIQUE(user_id) on user_selections

### RLS Policies
- Users can only see/modify their own selections
- Profile reference ensures cascading delete

---

## 🎨 UI/UX Features

### Category Selection Page
- **Visual Design:**
  - 3 colorful cards with gradients
  - Large icons (🏠 📊 📱)
  - Title + English subtitle
  - Detailed description
  - Hover effects

- **Interaction:**
  - Click to select
  - Selected card shows checkmark
  - Button shows "انتخاب شد ✓"
  - Loading spinner during submission
  - Auto-redirect on success

- **Error Handling:**
  - Error message displayed
  - Auto-redirect to login if unauthorized

### Pricing Page
- **Enhanced Features:**
  - Shows selected category at top
  - "Back to category selection" link if needed
  - Plan cards show selection state
  - Loading state on button during save
  - Breadcrumb navigation

---

## 🔗 API Endpoints

### Category Selection
```bash
POST /api/user-selections/category
{
  "category": "real-estate" | "marketing" | "social"
}

Response:
{
  "success": true,
  "message": "دسته‌بندی با موفقیت انتخاب شد",
  "category": "real-estate"
}
```

### Plan Selection
```bash
POST /api/user-selections/plan
{
  "plan_id": "free" | "plus" | "professional"
}

Response:
{
  "success": true,
  "message": "پلن با موفقیت انتخاب شد",
  "plan_id": "plus"
}
```

### Get User Selection
```bash
GET /api/user-selections/category

Response:
{
  "success": true,
  "selection": {
    "selected_category": "real-estate",
    "selected_plan_id": "plus",
    "selected_at": "2026-08-14T..."
  }
}
```

---

## 📊 Database Structure

### Before
```
profiles (users)
agents
user_agents (subscriptions)
agent_runs (history)
```

### After (NEW)
```
user_selections
  ├─ id (uuid)
  ├─ user_id (FK to profiles)
  ├─ selected_category (text)
  ├─ selected_plan_id (text)
  ├─ selected_at (timestamp)
  ├─ created_at (timestamp)
  └─ updated_at (timestamp)
```

**Query Examples:**
```sql
-- Get user's selection
SELECT * FROM user_selections WHERE user_id = 'xyz'

-- Get all users with selected category
SELECT user_id, selected_category FROM user_selections WHERE selected_category = 'real-estate'

-- Get users who selected a plan
SELECT * FROM user_selections WHERE selected_plan_id IS NOT NULL
```

---

## 🚀 Deployment Steps

### 1. Run Migration
In Supabase SQL Editor:
```sql
-- Copy content from supabase/migrations/add_user_selections.sql
-- Paste and run in SQL Editor
```

### 2. Test Locally
```bash
npm run dev
# Visit http://localhost:3000
# Click "شروع کنید" → Category Selection → Plan Selection
```

### 3. Verify in Supabase
- Check `user_selections` table has data
- Verify RLS policies working
- Test with multiple users

### 4. Deploy
```bash
git add .
git commit -m "feat: add category selection and plan flow"
git push
# Vercel deploys automatically
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Anonymous user can view category selection
- [ ] Click each category triggers selection
- [ ] Selection saves to database
- [ ] Category name shows on pricing page
- [ ] Can select different plans
- [ ] Plan selection saves to database
- [ ] Redirects to category page after plan selection
- [ ] Logged out user gets redirected to login
- [ ] Error messages display correctly

### Database Testing
```sql
-- Check user_selections table
SELECT * FROM user_selections;

-- Verify RLS policies
-- Try as different user and verify they can't see other users' data
```

---

## 📈 Analytics Opportunities

```sql
-- Most selected category
SELECT selected_category, COUNT(*) 
FROM user_selections 
GROUP BY selected_category;

-- Most selected plan
SELECT selected_plan_id, COUNT(*) 
FROM user_selections 
WHERE selected_plan_id IS NOT NULL
GROUP BY selected_plan_id;

-- Conversion funnel
SELECT 
  COUNT(DISTINCT user_id) as total_selections,
  COUNT(DISTINCT CASE WHEN selected_plan_id IS NOT NULL THEN user_id END) as plans_selected,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN selected_plan_id IS NOT NULL THEN user_id END) 
    / COUNT(DISTINCT user_id), 2) as conversion_rate
FROM user_selections;
```

---

## 🔄 Future Enhancements

1. **Category Switching**
   - Allow users to change category after selection
   - Show confirmation dialog

2. **Plan Upgrade/Downgrade**
   - Allow changing plan anytime
   - Handle pro-rata billing

3. **Recommendations**
   - Recommend plans based on category
   - Show popular choices

4. **Onboarding**
   - Add tooltips on first visit
   - Skip selection for returning users

5. **Analytics Dashboard**
   - Track conversion rates
   - Show popular categories/plans

---

## 🐛 Troubleshooting

**Q: User selection not saving?**
- Check migration was run
- Verify RLS policies are correct
- Check browser auth cookies

**Q: Page not showing selected category?**
- Verify API returns data
- Check GET endpoint works
- Browser network tab for errors

**Q: Redirect not working?**
- Check router.push() in useEffect
- Verify path is correct
- Check for navigation middleware

**Q: Database errors?**
- Run migration again
- Check table schema with \d user_selections
- Verify user_id exists in profiles

---

## 📝 Summary

✅ Three-category selection flow implemented
✅ Database schema updated
✅ API endpoints created
✅ Frontend pages updated
✅ User selections saved and tracked
✅ Builds successfully
✅ Ready for deployment

Next steps: Run migrations and deploy! 🚀
