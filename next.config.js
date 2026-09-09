/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
  images: {
    // Keep unoptimized to avoid breaking remote Pexels/Supabase URLs across envs.
    // Still use next/image for layout stability (width/height/fill + sizes).
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'tfigmkhchtvuhtqeeciq.supabase.co', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      // Role portals: /admin/as/{author|editor|admin}/... → same pages under /admin/...
      { source: '/admin/as/:role', destination: '/admin' },
      { source: '/admin/as/:role/:path*', destination: '/admin/:path*' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/login',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/reset-password',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

module.exports = nextConfig;
