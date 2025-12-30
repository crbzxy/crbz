import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['carlosboyzo.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
