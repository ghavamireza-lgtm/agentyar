-- Add user_selections table to track category and plan choices
CREATE TABLE IF NOT EXISTS user_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  selected_category TEXT,
  selected_plan_id TEXT,
  selected_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own selections" ON user_selections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selections" ON user_selections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selections" ON user_selections
  FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_user_selections_user_id ON user_selections(user_id);
CREATE INDEX idx_user_selections_category ON user_selections(selected_category);
