/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@opero/ui", "@opero/firebase", "@opero/config", "@opero/types"],
  reactStrictMode: true,
};
module.exports = nextConfig;
