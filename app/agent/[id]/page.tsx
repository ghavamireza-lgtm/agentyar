import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAgentById, getAllAgentIds, categories } from '@/data/agents'
import AgentForm from '@/components/agents/AgentForm'
import ActivateAgentButton from '@/components/agents/ActivateAgentButton'

interface AgentPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getAllAgentIds()
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    return { title: 'دستیار یافت نشد' }
  }

  return {
    title: agent.name,
    description: agent.description,
  }
}

function getCategorySlug(agentCategory: string): string | undefined {
  return Object.values(categories).find((cat) =>
    cat.agents.some((a) => a.category === agentCategory)
  )?.id
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    notFound()
  }

  const categorySlug = getCategorySlug(agent.category)

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <Link
          href={categorySlug ? `/category/${categorySlug}` : '/'}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
        >
          ← بازگشت
        </Link>

        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{agent.icon}</span>
            <div className="flex-1">
              <span className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {agent.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{agent.name}</h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">{agent.description}</p>
        </div>

        <ActivateAgentButton agent={agent} />

        <AgentForm agent={agent} />
      </div>
    </div>
  )
}
