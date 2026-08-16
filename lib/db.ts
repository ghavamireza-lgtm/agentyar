import { createClient } from '@/lib/supabase/server'
import { getCategoryConfig, categoryConfigs } from '@/data/categories'
import { pricingPlans } from '@/data/pricing'
import type { Agent, AgentRun, Category, FormField, PricingPlan, UserAgent } from '@/types'

type AgentRow = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  is_active: boolean
  icon: string | null
  fields: unknown
  created_at?: string
}

type UserAgentRow = {
  id: string
  user_id: string
  agent_id: string
  status: string
  activated_at: string
  agent: AgentRow | AgentRow[] | null
}

const AGENT_COLUMNS = 'id, slug, title, description, category, is_active, icon, fields, created_at'

function mapAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.title,
    description: row.description ?? '',
    category: row.category,
    icon: row.icon ?? '🤖',
    fields: Array.isArray(row.fields) ? (row.fields as FormField[]) : [],
    is_active: row.is_active,
  }
}

function unwrapAgent(value: AgentRow | AgentRow[] | null): Agent | null {
  if (!value) return null
  return mapAgent(Array.isArray(value) ? value[0] : value)
}

export async function getAgents(activeOnly = true): Promise<Agent[]> {
  const supabase = await createClient()

  let query = supabase
    .from('agents')
    .select(AGENT_COLUMNS)
    .order('created_at', { ascending: true })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((row: AgentRow) => mapAgent(row))
}

export async function getAgentBySlug(slug: string, activeOnly = true): Promise<Agent | null> {
  const supabase = await createClient()

  let query = supabase
    .from('agents')
    .select(AGENT_COLUMNS)
    .eq('slug', slug)

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.maybeSingle()
  if (error) throw error

  return data ? mapAgent(data as AgentRow) : null
}

export async function getAgentById(id: string, activeOnly = true): Promise<Agent | null> {
  const supabase = await createClient()

  let query = supabase
    .from('agents')
    .select(AGENT_COLUMNS)
    .eq('id', id)

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.maybeSingle()
  if (error) throw error

  return data ? mapAgent(data as AgentRow) : null
}

export async function getAgentSlugs(): Promise<string[]> {
  const agents = await getAgents()
  return agents.map((agent) => agent.slug)
}

export async function getCategories(): Promise<Category[]> {
  const agents = await getAgents()

  return categoryConfigs.map((config) => ({
    id: config.id,
    title: config.title,
    description: config.description,
    icon: config.icon,
    agents: agents.filter((agent) => agent.category === config.dbCategory),
  }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const config = getCategoryConfig(slug)
  if (!config) return null

  const agents = await getAgents()
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    icon: config.icon,
    agents: agents.filter((agent) => agent.category === config.dbCategory),
  }
}

export function getPricingPlans(): PricingPlan[] {
  return pricingPlans
}

export async function activateUserAgent(userId: string, agentId: string) {
  const supabase = await createClient()

  const { data: existing, error: findError } = await supabase
    .from('user_agents')
    .select('id, status')
    .eq('user_id', userId)
    .eq('agent_id', agentId)
    .maybeSingle()

  if (findError) throw findError

  if (existing) {
    if (existing.status === 'active') return existing

    const { data, error } = await supabase
      .from('user_agents')
      .update({
        status: 'active',
        activated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('id, status, activated_at')
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('user_agents')
    .insert({
      user_id: userId,
      agent_id: agentId,
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .select('id, status, activated_at')
    .single()

  if (error) throw error
  return data
}

export async function createAgentRun(
  userId: string,
  agentId: string,
  input: Record<string, unknown>,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agent_runs')
    .insert({
      user_id: userId,
      agent_id: agentId,
      input,
      status: 'running',
    })
    .select('id, user_id, agent_id, input, output, status, error, created_at, completed_at')
    .single()

  if (error) throw error
  return data
}

export async function completeAgentRun(
  runId: string,
  output: Record<string, unknown>,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agent_runs')
    .update({
      output,
      status: 'completed',
      error: null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', runId)
    .select('id, user_id, agent_id, input, output, status, error, created_at, completed_at')
    .single()

  if (error) throw error
  return data
}

export async function failAgentRun(runId: string, message: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('agent_runs')
    .update({
      status: 'failed',
      error: message,
      completed_at: new Date().toISOString(),
    })
    .eq('id', runId)

  if (error) throw error
}

export async function getUserAgents(userId: string): Promise<UserAgent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_agents')
    .select(`
      id,
      user_id,
      agent_id,
      status,
      activated_at,
      agent:agents (${AGENT_COLUMNS})
    `)
    .eq('user_id', userId)
    .order('activated_at', { ascending: false })

  if (error) throw error

  return (data ?? [])
    .map((row: UserAgentRow) => {
      const item = row
      const agent = unwrapAgent(item.agent)
      if (!agent) return null

      return {
        id: item.id,
        userId: item.user_id,
        agentId: item.agent_id,
        status: item.status,
        activatedAt: item.activated_at,
        agent,
      }
    })
    .filter((item): item is UserAgent => item !== null)
}

export async function getUserAgentRuns(
  userId: string,
  limit = 10,
): Promise<AgentRun[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agent_runs')
    .select('id, user_id, agent_id, input, output, status, error, created_at, completed_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []).map((row: {
    id: string
    user_id: string
    agent_id: string
    input: unknown
    output: unknown
    status: string
    error: string | null
    created_at: string
    completed_at: string | null
  }) => ({
    id: row.id,
    userId: row.user_id,
    agentId: row.agent_id,
    input: (row.input ?? {}) as Record<string, unknown>,
    output: row.output as Record<string, unknown> | null,
    status: row.status,
    error: row.error ?? null,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? null,
  }))
}
