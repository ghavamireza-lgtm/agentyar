-- AgentYar / AgentLine
-- RLS + constraints for the current database schema.
-- Run this once in Supabase SQL Editor.
--
-- IMPORTANT:
-- The agents table uses the column "is_active" according to the current schema.
-- If your real column is is_active, rename it in the application and this SQL.

create unique index if not exists agents_slug_unique
  on public.agents (slug);

create unique index if not exists user_agents_user_agent_unique
  on public.user_agents (user_id, agent_id);

alter table public.agents enable row level security;
alter table public.profiles enable row level security;
alter table public.user_agents enable row level security;
alter table public.agent_runs enable row level security;

-- Public catalog: visitors need to see active agents before login.
drop policy if exists "agents_public_read_active" on public.agents;
create policy "agents_public_read_active"
  on public.agents
  for select
  using ("is_active" = true);

-- A user can read only their own profile.
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
  on public.profiles
  for select
  using (id = auth.uid());

-- A user can read and activate only their own agents.
drop policy if exists "user_agents_read_own" on public.user_agents;
create policy "user_agents_read_own"
  on public.user_agents
  for select
  using (user_id = auth.uid());

drop policy if exists "user_agents_insert_own" on public.user_agents;
create policy "user_agents_insert_own"
  on public.user_agents
  for insert
  with check (user_id = auth.uid());

drop policy if exists "user_agents_update_own" on public.user_agents;
create policy "user_agents_update_own"
  on public.user_agents
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- A user can create and read only their own runs.
drop policy if exists "agent_runs_read_own" on public.agent_runs;
create policy "agent_runs_read_own"
  on public.agent_runs
  for select
  using (user_id = auth.uid());

drop policy if exists "agent_runs_insert_own" on public.agent_runs;
create policy "agent_runs_insert_own"
  on public.agent_runs
  for insert
  with check (user_id = auth.uid());

drop policy if exists "agent_runs_update_own" on public.agent_runs;
create policy "agent_runs_update_own"
  on public.agent_runs
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
