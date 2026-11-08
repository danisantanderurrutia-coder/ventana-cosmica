const isExport = process.env.EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  ...(isExport ? {
    output: 'export',
    basePath: basePath,
    assetPrefix: basePath ? `${basePath}/` : undefined,
  } : {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8001/api/:path*',
        },
      ];
    },
  }),
};

export default nextConfig;
