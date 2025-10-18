/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force use of Webpack instead of Turbopack
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

module.exports = nextConfig;
