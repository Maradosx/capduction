import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://capduction.com';
  const now  = new Date();
  // Only include pages with real content. /contact, /changelog, /careers,
  // /api-docs are still ComingSoon stubs — leave them out of the sitemap
  // until they have actual content, otherwise Google indexes thin pages.
  const pages = [
    { path: '/',          priority: 1.0,  changeFrequency: 'weekly' as const },
    { path: '/pricing',   priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/about',     priority: 0.6,  changeFrequency: 'monthly' as const },
    { path: '/docs',      priority: 0.7,  changeFrequency: 'weekly' as const },
    { path: '/login',     priority: 0.4,  changeFrequency: 'yearly' as const },
    { path: '/signup',    priority: 0.8,  changeFrequency: 'yearly' as const },
    { path: '/status',    priority: 0.3,  changeFrequency: 'daily'  as const },
    { path: '/privacy',   priority: 0.3,  changeFrequency: 'yearly' as const },
    { path: '/terms',     priority: 0.3,  changeFrequency: 'yearly' as const },
  ];
  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
