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
  // Lighthouse Best Practices scores 100 without any of these, so they have to
  // be chosen deliberately. They cost no bytes on the page — headers only.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops a browser guessing a different content type than we sent,
          // which is the basis of several upload-based attacks.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin to other sites, the full URL to ourselves — so our
          // paths never leak into a third party's analytics via Referer.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // This site asks for none of these. Denying them means an injected
          // script cannot either.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Clickjacking. frame-ancestors is the CSP-era replacement for
          // X-Frame-Options; 'self' keeps the Studio's own preview iframe working.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
  experimental: {
    // Sanity's studio bundle is large; keep it out of the main graph.
    optimizePackageImports: ["@sanity/image-url"],
    // Inlines the CSS into the document so it stops blocking first paint.
    inlineCss: true,
  },
};

export default nextConfig;
