import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
