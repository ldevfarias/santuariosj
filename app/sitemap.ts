import type { MetadataRoute } from 'next'

const SACRAMENTOS_SLUGS = [
  'baptism',
  'confirmation',
  'eucharist',
  'confession',
  'matrimony',
  'anointing-of-the-sick',
  'holy-orders',
]

const DEVOCOES_SLUGS = ['house-of-miracles', 'house-of-candles', 'ex-voto-museum']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://santuariosjoser.org.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://santuariosjoser.org.br/comunidades',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://santuariosjoser.org.br/secretaria',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://santuariosjoser.org.br/devocoes',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://santuariosjoser.org.br/episcopal',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...SACRAMENTOS_SLUGS.map((slug) => ({
      url: `https://santuariosjoser.org.br/sacramentos/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...DEVOCOES_SLUGS.map((slug) => ({
      url: `https://santuariosjoser.org.br/devocoes/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

