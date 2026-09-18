import type { NextConfig } from "next";

// GitHub Pages serves static files only: no proxy, no headers(), no route handlers with a body.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  typedRoutes: true,
};

export default nextConfig;
