/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/minimal-next-shop',
  trailingSlash: true,
  distDir: 'docs', // GitHub Pages expects 'docs' folder
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;