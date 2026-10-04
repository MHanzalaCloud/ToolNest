/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: 52428800,
    },
  },
};

export default nextConfig;