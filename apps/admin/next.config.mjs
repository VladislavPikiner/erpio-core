import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add custom resolution for @/ paths
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/': path.resolve(__dirname, './lib/'),
    };

    // If you need to transpile packages that use CJS modules or have specific TS requirements,
    // you might need to add them to transpilePackages.
    // config.transpilePackages = [
    //   '@repo/ui',
    //   '@erpio/shared',
    // ];

    return config;
  },
};

export default nextConfig;