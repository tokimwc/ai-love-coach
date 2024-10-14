/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  // framer-motionのトランスパイルを有効にする
  transpilePackages: ['framer-motion'],
};

module.exports = nextConfig;
