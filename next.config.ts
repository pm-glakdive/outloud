import type { NextConfig } from "next";

/**
 * Static export build: produces a fully-static `out/` directory that any
 * static host (Cloudflare Pages, Netlify, GitHub Pages, S3) can serve.
 *
 * Why static export for Outloud:
 *   - All UI is "use client" — no SSR data needs.
 *   - No /api routes; no server-rendered dynamic pages.
 *   - No middleware.
 * If we ever add server-side anything, we'll need to switch off `export`.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // Static export can't optimize images at request-time. We don't use
  // next/image yet, but flip this on so future Image components don't break.
  images: { unoptimized: true },
  // Cloudflare Pages serves a directory; trailing slash makes routing predictable.
  trailingSlash: true,
};

export default nextConfig;
