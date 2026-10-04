/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pdf/merge',
        destination: '/pdf',
        permanent: true,
      },
      {
        source: '/pdf/split',
        destination: '/pdf',
        permanent: true,
      },
      {
        source: '/pdf/compress',
        destination: '/pdf',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;