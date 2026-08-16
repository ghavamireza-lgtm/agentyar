export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
  required: boolean
}

export interface Agent {
  id: string
  slug: string
  name: string
  category: string
  description: string
  icon: string
  fields: FormField[]
  is_active: boolean
}

export interface Category {
  id: string
  title: string
  description: string
  icon: string
  agents: Agent[]
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  currency: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: 'primary' | 'outline'
  popular?: boolean
}

export interface AgentRun {
  id: string
  userId: string
  agentId: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: string
  error: string | null
  createdAt: string
  completedAt: string | null
}

export interface UserAgent {
  id: string
  userId: string
  agentId: string
  status: string
  activatedAt: string
  agent: Agent
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
