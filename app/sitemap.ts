import type { MetadataRoute } from 'next'
import { getAgentSlugs } from '@/lib/db'
import { categoryConfigs } from '@/data/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agentline.ir'
  const now = new Date()
  const agentSlugs = await getAgentSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...categoryConfigs.map((category) => ({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const agentPages: MetadataRoute.Sitemap = agentSlugs.map((slug) => ({
    url: `${baseUrl}/agent/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...agentPages]
}
