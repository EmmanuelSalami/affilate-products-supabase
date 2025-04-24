// next.config.mjs
var nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["m.media-amazon.com", "upload.wikimedia.org"]
  },
  assetPrefix: process.env.NODE_ENV === "production" ? void 0 : void 0,
  webpack(config) {
    return config;
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
