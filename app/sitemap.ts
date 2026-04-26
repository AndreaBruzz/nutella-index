import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nutella-index.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['it', 'en'] as const;
  const localizedPaths = ['/map', '/ranking', '/submit', '/info', '/info/data-info', '/info/terms-and-ip'];

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...locales.flatMap((locale) =>
      localizedPaths.map((path) => ({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '/map' || path === '/ranking' ? ('daily' as const) : path.startsWith('/info') ? ('monthly' as const) : ('weekly' as const),
        priority: path === '/map' ? 1 : path === '/ranking' ? 0.9 : path === '/submit' ? 0.7 : path === '/info' ? 0.6 : 0.5,
      }))
    ),
  ];
}
