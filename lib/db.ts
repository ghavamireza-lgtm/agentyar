import type { Agent, Category, PricingPlan, Submission } from '@/types'
import {
  agentsList,
  categories,
  getAgentById as getAgentFromData,
  getCategoryBySlug,
  pricingPlans,
} from '@/data/agents'

let submissions: Submission[] = []
let submissionIdCounter = 1

const categoriesData: Category[] = Object.values(categories)

export const db = {
  getAgents: () => agentsList,
  getAgentById: (id: string) => getAgentFromData(id),

  getCategories: () => categoriesData,
  getCategoryById: (id: string) => getCategoryBySlug(id),

  getPricingPlans: (): PricingPlan[] => pricingPlans,

  createSubmission: (data: Omit<Submission, 'id' | 'createdAt'>) => {
    const submission: Submission = {
      id: submissionIdCounter++,
      ...data,
      createdAt: new Date().toISOString(),
    }
    submissions.push(submission)
    return submission
  },
  getSubmissions: () => submissions,
  getSubmissionById: (id: number) => submissions.find((s) => s.id === id),

  reset: () => {
    submissions = []
    submissionIdCounter = 1
  },
}

export type { Agent, Category }
