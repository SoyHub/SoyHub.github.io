import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// GitHub Pages serves static files only: no proxy, no headers(), no route handlers with a body.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  typedRoutes: true,
};

export default createNextIntlPlugin()(nextConfig);
