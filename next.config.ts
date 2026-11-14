import type { NextConfig } from 'next';

/**
 * `STATIC_EXPORT=1 npm run build` emits a fully static site into `out/`,
 * which can be dropped onto Netlify, Cloudflare Pages, GitHub Pages or any
 * static host without a repository or a build service.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.STATIC_EXPORT ? 'export' : undefined,
  images: { unoptimized: true },
  experimental: { cpus: 1, workerThreads: false },
};

export default nextConfig;
