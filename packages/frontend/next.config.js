const withPWA = require("next-pwa");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  optimizeFonts: false,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  reactStrictMode: false,
  sassOptions: {
    additionalData: async (content, { resourcePath }) => {
      if (resourcePath.includes("node_modules")) {
        return content;
      }

      if (resourcePath.endsWith("mq-settings.scss")) {
        return process.env.NODE_ENV === "production" ? "" : content;
      }

      return "@use 'styles/mq' as mq;" + content;
    },
    includePaths: [path.join(__dirname, "src/styles")],
  },
  swcMinify: true,
});

module.exports = nextConfig;
