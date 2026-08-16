-- Agentyar Database Seed Script
-- Run this in Supabase SQL Editor to populate initial data

-- ============================================
-- INSERT AGENTS
-- ============================================

INSERT INTO agents (id, slug, title, description, category, is_active, created_at, updated_at) VALUES
  -- Real Estate Agents
  ('550e8400-e29b-41d4-a716-446655440001', 'price-advisor', 'مشاور قیمت‌گذاری ملک', 'با وارد کردن مشخصات ملک، قیمت پیشنهادی مناسب را دریافت کنید', 'املاک', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'ad-writer', 'نویسنده آگهی ملک', 'مشخصات ملک خود را وارد کنید تا یک آگهی جذاب و حرفه‌ای دریافت کنید', 'املاک', true, NOW(), NOW()),

  -- Marketing Agents
  ('550e8400-e29b-41d4-a716-446655440003', 'sales-content', 'تولیدکننده محتوای فروش', 'محتوای فروش حرفه‌ای برای محصولات و خدمات شما', 'فروش و بازاریابی', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'competitor-analyzer', 'تحلیل‌گر رقبا', 'تحلیل هوشمند رقبا و دریافت راهکارهای رقابتی', 'فروش و بازاریابی', true, NOW(), NOW()),

  -- Social Media Agents
  ('550e8400-e29b-41d4-a716-446655440005', 'instagram-content', 'تولیدکننده محتوای اینستاگرام', 'محتوای جذاب برای اینستاگرام و شبکه‌های اجتماعی', 'شبکه‌های اجتماعی', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006', 'hashtag-generator', 'تولیدکننده هشتگ', 'هشتگ‌های مناسب و محبوب برای محتوای شما', 'شبکه‌های اجتماعی', true, NOW(), NOW());

-- ============================================
-- VERIFY DATA
-- ============================================

SELECT count(*) as total_agents FROM agents;
SELECT id, title, category, is_active FROM agents ORDER BY category;
