/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // This allows any external image URL to be used with the Image component
  },
};

export default nextConfig;
