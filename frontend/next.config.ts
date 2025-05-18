import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
	typescript: {
		ignoreBuildErrors: true, // Disables ALL TypeScript errors
	},
	eslint: {
		ignoreDuringBuilds: true, // Disables ESLint
	},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },{
        protocol:"https",
        hostname:"sanaa.fra1.digitaloceanspaces.com"
      },{
        protocol:"https",
        hostname:"th.bing.com"
      }]
}}

export default nextConfig;
