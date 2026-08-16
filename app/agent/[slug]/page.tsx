import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { categoryConfigs } from '@/data/categories'
import { getAgentBySlug } from '@/lib/db'
import AgentForm from '@/components/agents/AgentForm'

interface AgentPageProps {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({
  params,
}: AgentPageProps): Promise<Metadata> {
  const { slug } = await params
  const agent = await getAgentBySlug(slug)

  if (!agent) return { title: 'دستیار یافت نشد' }

  return {
    title: agent.name,
    description: agent.description,
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params
  const agent = await getAgentBySlug(slug)

  if (!agent) notFound()
  const currentAgent = agent

  const category = categoryConfigs.find(
    (item) => item.dbCategory === currentAgent.category,
  )

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <Link
          href={category ? `/category/${category.id}` : '/'}
          className="mb-8 inline-flex font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          ← بازگشت
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex items-start gap-4">
            <span className="text-5xl">{currentAgent.icon}</span>
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                {currentAgent.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {currentAgent.name}
              </h1>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-gray-600">
            {currentAgent.description}
          </p>
        </div>

        <AgentForm agent={currentAgent} />
      </div>
    </div>
  )
}
