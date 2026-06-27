import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@erpio/shared'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/*': path.resolve(__dirname, 'src'),
      '@erpio/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
    };
    return config;
  },
};

export default nextConfig;
