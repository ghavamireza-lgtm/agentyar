import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryBySlug } from '@/data/agents'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [{ slug: 'real-estate' }, { slug: 'marketing' }]
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return { title: 'دسته‌بندی یافت نشد' }
  }

  return {
    title: category.title,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{category.title}</h1>
              <p className="text-lg text-gray-600 mt-2">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {category.agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agent/${agent.id}`}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{agent.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">{agent.description}</p>
                  <div className="mt-4 text-primary-600 font-medium group-hover:mr-2 transition-all inline-block">
                    استفاده از دستیار ←
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
