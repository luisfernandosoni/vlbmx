# VLBMX.COM: The Ultra-Premium Volleyball Livestream Aggregator Masterplan

> **Version:** 1.0.0
> **Date:** February 2026
> **Classification:** Silicon Valley Bleeding Edge

## 1. Executive Summary & Aesthetic Vision

VLBMX is not just an aggregator; it is a premium, cinematic experience for volleyball enthusiasts. Designed with the minimalist, high-craft ethos of Jony Ive and Steve Jobs, the platform presents overwhelming amounts of live data and video streams in an interface that feels invisible, fluid, and intuitive.

**Primary Objectives:**

1. **Automated Aggregation:** Headless, highly-resilient fetching of streams and metadata from gated origin sites.
2. **Premium Playback:** A video player that rivals YouTube and Netflix in features (PIP, Chromecast, DVR, ultra-fast TTFB).
3. **Community & Real-time:** Real-time chat per game, synchronized schedules.
4. **Monetization & Analytics:** Stealth ads resistant to blockers, advanced visitor KPIs.
5. **Bleeding-Edge Tech Stack:** Leveraging the exact same patterns used by the top 1% of SV engineers in 2025/2026.

---

## 2. Infrastructure Architecture: The Hybrid Edge-Metal Pattern

### Why Hybrid (Cloudflare + Hetzner)?

A common mistake is putting everything on Vercel/Cloudflare (too expensive/restrictive for heavy scraping and video proxying) or everything on AWS EC2 (too slow for global edge delivery, massive egress costs). The "Golden Nugget" architecture for a video aggregator is the **Cloudflare Edge + Hetzner Metal Hybrid**.

#### Cloudflare (The Edge Layer)

- **Cloudflare Pages / Next.js:** Deploys the frontend. Lightning-fast static asset delivery and edge SSR.
- **Cloudflare Workers (API Gateway):** Handles lightweight API requests.
- **Cloudflare D1 / Hyperdrive:** Distributed edge database.
- **Cloudflare Durable Objects:** The absolute state-of-the-art for Chat. No Redis needed.

#### Hetzner (The Metal Layer)

- **Hetzner AX Line Dedicated Servers:** Cost-to-performance ratio is unmatched globally.
- **Scraping Fleet (Docker + Playwright):** Dedicated containers running stealth scraping logic.
- **NGINX Video Proxying Cache:** Route through Hetzner using highly tuned NGINX instances.
- **Bandwidth:** Hetzner offers massive, uncapped or 1Gbit/s unmetered bandwidth.

---

## 3. Detailed Component Deep-Dives

### A. The Scraping & Extraction Engine (Playwright Stealth + Docker)

Scraping gated video platforms requires military-grade stealth.

```dockerfile
# Hetzner Scraping Node Dockerfile
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Install dependencies for stealth bypassing
RUN apt-get update && apt-get install -y xvfb x11vnc fluxbox

WORKDIR /app
COPY package*.json ./
RUN npm install playwright-extra puppeteer-extra-plugin-stealth
COPY . .

# Run with XVFB for headed stealth (headless=false is less detectable)
CMD ["xvfb-run", "-a", "node", "scraper.js"]
```

```javascript
// scraper.js
const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
chromium.use(stealth);

async function extractStream(url) {
  const browser = await chromium.launch({ headless: false }); // Headed mode in XVFB
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
    timezoneId: "America/New_York",
  });

  const page = await context.newPage();

  // Intercept the m3u8 request
  let streamUrl = null;
  page.on("request", (request) => {
    if (request.url().includes(".m3u8")) {
      streamUrl = request.url();
    }
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  // Wait for the video player to initialize
  await page.waitForTimeout(5000);

  await browser.close();
  return streamUrl;
}
```

### B. Video Proxy Tuning (NGINX on Hetzner)

To bypass CORS and hide the origin URL, we proxy the `.m3u8` and `.ts` chunks through Hetzner.

```nginx
# nginx.conf (Hetzner Proxy Hub)
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=video_cache:100m max_size=10g inactive=60m use_temp_path=off;

server {
    listen 443 ssl http2;
    server_name proxy.vlbmx.com;

    location ~ \.(m3u8|mpd)$ {
        # Don't cache manifests for long
        proxy_cache video_cache;
        proxy_cache_valid 200 2s;
        proxy_pass https://origin-server.com;

        # Sub_filter to rewrite TS chunk URLs to loop back to our proxy
        sub_filter 'https://origin-server.com/' 'https://proxy.vlbmx.com/';
        sub_filter_once off;
        sub_filter_types application/vnd.apple.mpegurl;

        # Add CORS headers for our frontend
        add_header Access-Control-Allow-Origin "https://vlbmx.com";
    }

    location ~ \.ts$ {
        # Cache video chunks heavily
        proxy_cache video_cache;
        proxy_cache_valid 200 24h;
        proxy_pass https://origin-server.com;
        add_header X-Cache-Status $upstream_cache_status;
        add_header Access-Control-Allow-Origin "https://vlbmx.com";
    }
}
```

### C. Chat Architecture (Cloudflare Durable Objects)

Using WebSockets with Durable Objects guarantees 13ms latency globally with no Redis setup.

```typescript
// worker.ts (Cloudflare Worker)
export class ChatRoom {
  state: DurableObjectState;
  sessions: WebSocket[];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.sessions = [];
  }

  async fetch(request: Request) {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(server);
    this.sessions.push(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // Broadcast to all connected clients
    this.sessions.forEach((session) => {
      if (session !== ws) {
        session.send(message);
      }
    });
  }

  async webSocketClose(ws: WebSocket) {
    this.sessions = this.sessions.filter((session) => session !== ws);
  }
}
```

### D. Advanced Video Player (Vidstack)

Vidstack integrates HLS natively, wraps the UI in Tailwind, and supports Chromecast.

```tsx
// components/Player.tsx
import "vidstack/styles/defaults.css";
import "vidstack/styles/community-skin/video.css";
import { MediaCommunitySkin, MediaOutlet, MediaPlayer } from "@vidstack/react";

export function VLBMXPlayer({ streamUrl, posterUrl }) {
  return (
    <MediaPlayer
      src={streamUrl}
      poster={posterUrl}
      crossOrigin="anonymous"
      className="w-full h-full rounded-2xl shadow-2xl overflow-hidden glassmorphism-border"
    >
      <MediaOutlet />
      <MediaCommunitySkin />
    </MediaPlayer>
  );
}
```

### E. MercadoPago Zero-Trust Webhooks

Never trust the payload. Always query the API.

```typescript
// app/api/webhooks/mercadopago/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const dataID = url.searchParams.get("data.id") || (await req.json()).data?.id;

  if (!dataID) return NextResponse.json({ error: "No ID" }, { status: 400 });

  // ZERO TRUST: Fetch the actual payment status from MercadoPago
  const mpResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${dataID}`,
    {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    },
  );

  const paymentData = await mpResponse.json();

  if (paymentData.status === "approved") {
    // Fulfill order, upgrade user to VIP
    await db
      .update(users)
      .set({ role: "VIP" })
      .where(eq(users.id, paymentData.payer.id));
  }

  return NextResponse.json({ received: true });
}
```

### F. Drizzle ORM Schema (Cloudflare D1)

Serverless SQLite edge database configuration.

```typescript
// schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").default("user"), // 'user', 'vip', 'admin'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  league: text("league").notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  streamUrl: text("stream_url"), // Populated by Hetzner Scraper
  status: text("status").default("upcoming"), // 'upcoming', 'live', 'ended'
});
```

---

## 4. UI/UX "Pro Max" Aesthetics

The UI must be aggressively minimalistic.

- **Glassmorphism:** Use `backdrop-blur-2xl bg-white/5` for overlays.
- **Typography:** `font-inter tracking-tight` for all UI text.
- **Motion:** `transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)`.

```css
/* Custom CSS extensions */
@layer utilities {
  .glass-panel {
    @apply bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-3xl;
  }
}
```

### G. Auth Integration (Better Auth)

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
  },
});
```
