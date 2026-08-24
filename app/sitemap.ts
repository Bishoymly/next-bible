import { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/sitemap';
import legacy from '@/public/generated/legacy/manifest.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await generateSitemapEntries();
  
  const legacyEntries = (legacy.records as { pathname: string; updatedAt?: string }[])
    .filter((entry) => entry.pathname === '/study' || entry.pathname === '/topics' || entry.pathname.startsWith('/study/') || entry.pathname.startsWith('/topics/'))
    .map((entry) => ({
      url: entry.pathname,
      ...(entry.updatedAt && !Number.isNaN(Date.parse(entry.updatedAt))
        ? { lastModified: new Date(entry.updatedAt) }
        : {}),
    }));
  const uniqueEntries = [...new Map([...entries, ...legacyEntries].map((entry) => [entry.url, entry])).values()];

  return uniqueEntries.map(({ url, lastModified }) => ({
    url: `https://bible.bishoy.io${url}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: 'monthly',
    priority: url === '/' ? 1 : 0.8,
  }));
}
