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
              "media-src 'self' blob: https://files.vidstack.io https://*.vidstack.io https://vlbmx.com",
              // M2 FIX: Added production Cloudflare Worker domain for WebSockets
              "connect-src 'self' ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:* wss://*.workers.dev https://files.vidstack.io https://*.vidstack.io",
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
  // H4 FIX: Removed rewrite block. Next.js rewriting cannot proxy WebSocket upgrades.
  // The client will now connect directly to the Worker in local dev.
};

export default nextConfig;
