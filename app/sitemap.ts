// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import {  Agents } from '../lib/db'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://agentyar.ir'
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/category/real-estate`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/marketing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  const agentPages = getAllAgentIds().map(({ id }) => ({
    url: `${baseUrl}/agent/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...agentPages]
}