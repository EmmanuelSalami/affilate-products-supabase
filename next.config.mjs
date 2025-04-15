/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['m.media-amazon.com', 'upload.wikimedia.org'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  webpack(config) {
    return config;
  },
};

export default nextConfig;
