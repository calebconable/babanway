import type { NextConfig } from 'next';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Setup Cloudflare dev platform for local development
if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Security and performance headers
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static images
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beban.pages.dev',
      },
      {
        protocol: 'https',
        hostname: 'www.nestleprofessional.ph',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Optimize production builds
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true,
    },
  }),

  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
