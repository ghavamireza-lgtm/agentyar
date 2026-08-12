import type { MetadataRoute } from 'next'
import { getAllAgentIds } from '@/data/agents'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://agentyar.ir'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/real-estate`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/marketing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const agentPages: MetadataRoute.Sitemap = getAllAgentIds().map(({ id }) => ({
    url: `${baseUrl}/agent/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...agentPages]
}
