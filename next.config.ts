import type { NextConfig } from 'next';

/**
 * Two build modes:
 *   next build                     → normal server build
 *   STATIC_EXPORT=1 next build     → static site in out/, for any host
 *   PAGES=1 next build             → static site in out/ with the /ankita base
 *                                    path, for a GitHub Pages project site
 */
const isExport = Boolean(process.env.STATIC_EXPORT || process.env.PAGES);
const basePath = process.env.PAGES ? '/ankita' : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: isExport ? 'export' : undefined,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  experimental: { cpus: 1, workerThreads: false },
};

export default nextConfig;
