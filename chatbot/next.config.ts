import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: "build", // Ensures build output directory is correctly set
};

export default nextConfig;
