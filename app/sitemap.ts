import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // It's important to use your production URL here.
  // You should probably store this in an environment variable.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // List of your static pages
  const staticRoutes = [
    '/',
    '/capture',
    '/upload',
    '/settings',
    '/privacy',
    '/terms',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    // Adjust change frequency and priority as needed
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  return sitemapEntries;
}