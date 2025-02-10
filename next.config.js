/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'fs': false,
      'path': false,
    };
    return config;
  },
  crossOrigin: 'anonymous',
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig; 