import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://capduction.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow:    ['/'],
        disallow: ['/api/', '/dashboard/', '/auth/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
