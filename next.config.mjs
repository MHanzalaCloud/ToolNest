/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // Required for Cloudflare Pages static route separation
  images: {
    unoptimized: true,
  },
};

export default nextConfig;