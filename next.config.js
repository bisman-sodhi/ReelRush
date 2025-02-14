/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'fs': false,
      'path': false,
    };

    // Add rule for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      type: 'javascript/auto',
    });

    // Exclude sharp from client-side bundle
    config.externals.push({
      'sharp': 'commonjs sharp',
      '@xenova/transformers': 'commonjs @xenova/transformers'
    });

    return config;
  },
  crossOrigin: 'anonymous',
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig; 