import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @security-auditor: CSP headers to allow HLS media streaming from verified sources
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow inline scripts needed by Vidstack player
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Allow media from HLS proxy domains (update to Hetzner IP when live)
              "media-src 'self' blob: https://files.vidstack.io https://*.vidstack.io",
              // Allow HLS manifest/segment fetch and local dev websockets
              "connect-src 'self' ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:* https://files.vidstack.io https://*.vidstack.io",
              "img-src 'self' data: blob: https://files.vidstack.io https://*.vidstack.io",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/chat/:path*",
        // Proxies local Dev chat-worker. In Prod, Cloudflare routes this directly to the worker.
        destination: "http://127.0.0.1:8787/api/chat/:path*",
      },
    ];
  },
};

export default nextConfig;
