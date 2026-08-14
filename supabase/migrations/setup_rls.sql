-- Agentyar Supabase RLS Policies Setup

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- AGENTS TABLE POLICIES
-- ============================================

-- Anyone can view active agents (public read)
CREATE POLICY "Anyone can view active agents" ON agents
  FOR SELECT USING (is_active = true);

-- ============================================
-- USER_AGENTS TABLE POLICIES
-- ============================================

-- Users can view their own user_agents
CREATE POLICY "Users can view own user_agents" ON user_agents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert user_agents for themselves
CREATE POLICY "Users can insert user_agents for themselves" ON user_agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own user_agents
CREATE POLICY "Users can update own user_agents" ON user_agents
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- AGENT_RUNS TABLE POLICIES
-- ============================================

-- Users can view their own agent_runs
CREATE POLICY "Users can view own agent_runs" ON agent_runs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert agent_runs for themselves
CREATE POLICY "Users can insert agent_runs for themselves" ON agent_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own agent_runs (for status/output updates)
CREATE POLICY "Users can update own agent_runs" ON agent_runs
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User_agents indexes
CREATE INDEX idx_user_agents_user_id ON user_agents(user_id);
CREATE INDEX idx_user_agents_agent_id ON user_agents(agent_id);
CREATE INDEX idx_user_agents_status ON user_agents(status);

-- Agent_runs indexes
CREATE INDEX idx_agent_runs_user_id ON agent_runs(user_id);
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_created_at ON agent_runs(created_at DESC);

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Agents indexes
CREATE INDEX idx_agents_is_active ON agents(is_active);
CREATE INDEX idx_agents_category ON agents(category);
