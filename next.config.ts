/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['carlosboyzo.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

module.exports = nextConfig;
