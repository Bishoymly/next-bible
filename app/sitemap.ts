import { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await generateSitemapEntries();
  
  return entries.map(({ url, lastModified }) => ({
    url: `https://www.holybiblereader.com${url}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: url === '/' ? 1 : 0.8,
  }));
} 