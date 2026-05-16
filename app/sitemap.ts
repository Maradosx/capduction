import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://capduction.app';
  const now  = new Date();
  const pages = [
    { path: '/',          priority: 1.0,  changeFrequency: 'weekly' as const },
    { path: '/pricing',   priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/login',     priority: 0.5,  changeFrequency: 'yearly' as const },
    { path: '/signup',    priority: 0.8,  changeFrequency: 'yearly' as const },
    { path: '/about',     priority: 0.4,  changeFrequency: 'monthly' as const },
    { path: '/contact',   priority: 0.4,  changeFrequency: 'monthly' as const },
    { path: '/docs',      priority: 0.5,  changeFrequency: 'weekly' as const },
    { path: '/changelog', priority: 0.5,  changeFrequency: 'weekly' as const },
    { path: '/status',    priority: 0.3,  changeFrequency: 'hourly' as const },
    { path: '/privacy',   priority: 0.2,  changeFrequency: 'yearly' as const },
    { path: '/terms',     priority: 0.2,  changeFrequency: 'yearly' as const },
  ];
  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
