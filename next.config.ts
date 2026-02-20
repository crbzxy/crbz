import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'carlosboyzo.com', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
