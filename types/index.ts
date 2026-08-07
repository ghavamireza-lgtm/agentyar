// src/types/index.ts
export interface Agent {
  id: string
  name: string
  category: string
  description: string
  icon: string
  fields: FormField[]
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
  required: boolean
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

export interface Submission {
  id: number
  agentId: string
  data: Record<string, string | number>
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}