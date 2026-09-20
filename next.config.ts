import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AK-PERF-012 — never leave image settings on defaults.
    // AVIF first: ~30% smaller than WebP, and 38 PNGs are the page's bulk.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Locale-switcher flags, proxied so the browser never opens a
      // connection to a third-party origin.
      { protocol: "https", hostname: "flagcdn.com" },
    ],
    // Matches the Tailwind breakpoints actually used in globals.css, so we are
    // not generating sizes nothing ever requests.
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    // Sanity's studio bundle is large; keep it out of the main graph.
    optimizePackageImports: ["@sanity/image-url"],
    // Inlines the CSS into the document so it stops blocking first paint.
    inlineCss: true,
  },
};

export default nextConfig;
