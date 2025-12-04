/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/minimal-next-shop', 

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;