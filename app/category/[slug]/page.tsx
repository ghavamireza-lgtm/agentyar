import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryBySlug } from '@/lib/db'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return { title: 'دسته‌بندی یافت نشد' }

  return {
    title: category.title,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()
  const currentCategory = category

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-5xl">{currentCategory.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{currentCategory.title}</h1>
              <p className="mt-2 text-lg text-gray-600">{currentCategory.description}</p>
            </div>
          </div>
        </div>

        {currentCategory.agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
            فعلاً دستیار فعالی در این دسته وجود ندارد.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {currentCategory.agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agent/${agent.slug}`}
                className="card group transition-all hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-4xl">{agent.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                      {agent.name}
                    </h3>
                    <p className="mt-2 leading-relaxed text-gray-600">
                      {agent.description}
                    </p>
                    <div className="mt-4 inline-block font-medium text-primary-600">
                      استفاده از دستیار ←
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
