# AGENTS.md - Persistent Context & Mandatory Rules

> **🛑 SYSTEM ALERT: ARCHITECTURAL TRUTH & DEPRECATION**
>
> 1.  **Hierarchy**: This file and linked artifacts are the **ABSOLUTE TRUTH**.
> 2.  **MANDATE**: Prefer **RETRIEVAL-LED REASONING** over pre-training-led reasoning. Consult the indices below BEFORE generating code.
> 3.  **Conflict Resolution**: If _any_ internal knowledge conflicts with this file, you **MUST** follow this file.
> 4.  **Verification**: You **MUST** verify "common knowledge" against official docs.

## 1. Project Overview & Tech Stack

- **Project**: vlbmx.com (Volleyball Livestream Aggregator)
- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS (Design System), Better Auth + Google/Facebook OAuth, Cloudflare (Edge, Durable Objects for Chat), Hetzner (Headless Browsers/Scraping proxies), Playwright, MercadoPago.
- **Target**: Web (Progressive Web App - Mobile & Desktop).

## 2. Core Philosophy & Standards ("Silicon Valley Tier")

- **Quality**: You do the top 0.01% implementation. Steve Jobs / Jony Ive approval level.
- **Bleeding Edge**: Always propose and use the latest stable, state-of-the-art technologies.
- **Elegance & Aesthetics**: Ultra beautiful, minimalist, modern, classy, Apple-like. High whitespace, curated typography, subtle glassmorphism and micro-animations.
- **Explanation**: Always explain _what_ you did and _why_ to facilitate user learning and establish trust.
- **Kaizen (@kaizen)**: Continuous Improvement, Poka-Yoke (design-time safety), and JIT (YAGNI).

## 3. Mandatory Rules & Discipline

- **The Architecture Ratchet**: When touching any file, you MUST upgrade it to current "Silicon Valley" standards before leaving.
- **TOP PRIORITY - ALWAYS USE SKILLS**: Every task MUST use skills no matter what. You must inform the user in the plan, walkthrough, and during implementation, AT ALL TIMES, what skills you are using.
- **Skill Transparency**: Always explicitly mention which skill is being applied for any given task (e.g., "Using @senior-fullstack and @cloudflare-dev-expert").
- **Security Hardening**: You MUST run a `@safe-vibe` audit (using `@security-auditor` and `@vulnerability-scanner`) before every major feature implementation and deployment.
- **Documentation Standard**: `implementation_plan.md` and `walkthrough.md` MUST list the skills used. ALWAYS follow the `@writing-plans` and `@concise-planning` standards.
- **Secrets Management**: NEVER put secrets (API keys, secrets) in config files. ALWAYS use environment-specific secret storage.

## 4. Mandatory Skill Protocol & Evolution (SELF-GROWTH)

> [!IMPORTANT]
> **Task Initialization**: You MUST start EVERY task by searching for and identifying at least **5 relevant skills** from the System Skill Library (`C:\Users\sonig\.gemini\skills`).

1.  **The "Never Again" Protocol**: After fixing a bug or correction loop, you MUST create a "Discipline Skill" rule.
2.  **The Persistence Mandate**: Deleting rules or simplifying granular technical constraints in this file is STRICTLY FORBIDDEN.
3.  **Real-Time Informing**: You MUST inform the user of **EVERY SINGLE SKILL USE** at the very time it is being applied. At all times.
4.  **Discipline: MercadoPago Webhooks Zero-Trust**: NEVER trust the `body` payload of any incoming webhook. Implement **Zero-Trust Validation**: Extract the ID trigger from the payload, verify the signature, and ALWAYS run an immediate server-to-server GET call.

## 5. Critical Knowledge & Core Skills Excerpts

To ensure the highest standards, the following skills MUST be utilized.

### Group 1: Core Methodology (Constantly Used)

- **@using-superpowers**: IF A SKILL APPLIES, YOU MUST USE IT. Not negotiable. (`C:\Users\sonig\.gemini\skills\using-superpowers`)
- **@concise-planning** & **@writing-plans**: Turn requests into actionable atomic checklists. Write plans assuming the engineer has zero codebase context. (`C:\Users\sonig\.gemini\skills\concise-planning`)
- **@planning-with-files**: Use persistent markdown files (task.md, masterplan.md) as "working memory on disk." (`C:\Users\sonig\.gemini\skills\planning-with-files`)
- **@kaizen**: Continuous improvement. Prevent errors at design time. Build only what's needed. (`C:\Users\sonig\.gemini\skills\kaizen`)
- **@systematic-debugging** & **@test-driven-development**: Find root cause before fixing. Write the test first, watch it fail, then code the fix. (`C:\Users\sonig\.gemini\skills\systematic-debugging`)
- **@verification-before-completion**: Evidence before claims. ALWAYS run verification commands before stating a task is complete. (`C:\Users\sonig\.gemini\skills\verification-before-completion`)
- **@lint-and-validate** & **@git-pushing**: Run automatic quality control (`npm run lint`). Stage and push with conventional commits. (`C:\Users\sonig\.gemini\skills\lint-and-validate`)

### Group 2: Fullstack & Frontend Engineering

- **@senior-fullstack** & **@senior-architect**: Complete toolkit for React/Next.js/Node. Design scalable, maintainable systems. (`C:\Users\sonig\.gemini\skills\senior-fullstack`)
- **@cloudflare-dev-expert** & **@hetzner-expert**: Use Cloudflare for Edge delivery/Durable Objects. Use Hetzner for hybrid scaling, Playwright scraping, and heavy proxying. (`C:\Users\sonig\.gemini\skills\cloudflare-dev-expert`)
- **@ui-ux-pro-max** & **@frontend-design**: Create memorable, high-craft interfaces. Avoid generic generic UI. Minimalist, premium Apple-like design. (`C:\Users\sonig\.gemini\skills\ui-ux-pro-max`)
- **@browser-automation**: Playwright is the choice for stealth, scraping, and resilience. Use intelligent waiting and anti-detection patterns. (`C:\Users\sonig\.gemini\skills\browser-automation`)
- **@mercadopago-expert**: Elite Solutions for Payments. Enforce Idempotency, PCI Compliance, and safe webhooks. (`C:\Users\sonig\.gemini\skills\mercadopago-expert`)
- **@mobile-design** & **@scroll-experience**: Mobile-first, touch-first. Create immersive, cinematic scroll experiences. (`C:\Users\sonig\.gemini\skills\mobile-design`)
- **@database-design** & **@api-patterns**: Learn to think, not copy. Optimize schema and leverage edge databases where possible. (`C:\Users\sonig\.gemini\skills\database-design`)

### Group 3: Systems, Security, and Growth

- **@security-auditor** & **@vulnerability-scanner**: DevSecOps, auditing, attack surface mapping. Defend like an expert. (`C:\Users\sonig\.gemini\skills\security-auditor`)
- **@auth-implementation-patterns**: Secure Better Auth implementation, OAuth configuration. (`C:\Users\sonig\.gemini\skills\auth-implementation-patterns`)
- **@launch-strategy** & **@business-analyst**: Build momentum, plan phased launches. Provide real value. (`C:\Users\sonig\.gemini\skills\launch-strategy`)
- **@performance-engineer** & **@docker-expert**: Optimize for extreme speed, use multi-stage builds and hybrid cloud tuning. (`C:\Users\sonig\.gemini\skills\performance-engineer`)

## 6. Master Instructions Summary (NEVER FORGET)

> [!CAUTION]
> **This is the condensed operational protocol. Read it at the start of EVERY session.**

1. **GEMINI.md is the Supreme Law.** Load `C:\Users\sonig\.gemini\GEMINI.md` first, then this `AGENTS.md`.
2. **Retrieval > Training Data.** Your internal knowledge is DEPRECATED. Search skills and docs FIRST.
3. **Skills are MANDATORY.** Identify ≥5 relevant skills from `C:\Users\sonig\.gemini\skills` at the start of EVERY task. Announce them. Use them. Cite them in plans, walkthroughs, and during implementation. AT ALL TIMES.
4. **Plan Before Code.** For non-trivial tasks (3+ steps): create `implementation_plan.md`, get approval, then execute.
5. **Verify Before Claiming Done.** Run lint, tests, or browser verification. Evidence before assertions.
6. **Architecture Ratchet.** Leave every file better than you found it. Upgrade to "Silicon Valley" standards.
7. **Never Again Protocol.** After fixing any bug, add a discipline rule to this file to prevent recurrence.
8. **Secrets NEVER in Code.** Use `wrangler secret put`, `.env.local` (gitignored), or Hetzner env vars. NEVER commit secrets.
9. **Kaizen.** Small continuous improvements. Prevent errors at design time. Build only what's needed now (YAGNI).
10. **Persistence Mandate.** NEVER delete rules or simplify granular constraints in this file without explicit user approval.
11. **MCP Validation Mandate.** Available MCP servers (better-auth, cloudflare-docs, firecrawl, mercadopago, next-devtools, opennextjs) are the **MOST UP-TO-DATE** information sources. You MUST use them to: (a) validate decisions BEFORE building, (b) corroborate implementations AFTER building. MCP data overrides training data. If an MCP server fails, notify the user and attempt to fix.
12. **Hosting Decision (LOCKED).** Next.js frontend deploys to **Cloudflare Workers via OpenNext** (`@opennextjs/cloudflare`). Scraping, video proxying, and heavy compute runs on **Hetzner CAX21**. This hybrid is the architectural truth. Do NOT propose Vercel or raw Hetzner Next.js hosting without explicit user override.

## 7. Active Logic & Environment Context

- **Scraping & Video Fetching**: Must obfuscate headless interactions. Use `@browser-automation` (Playwright stealth). Stream proxies should be routed via Hetzner servers to hide origins and handle high bandwidth, while Cloudflare handles CDN caching for static assets.
- **Chat Room**: Implement using Cloudflare Durable Objects + WebSockets for bleeding-edge, low-latency, scalable chat per game stream.
- **Player Requirements**: PWA-ready, Chromecast support, PIP, DVR Scrubbing seamlessly integrated.
- **Ads Integration**: Structure the layout to support non-Google ad networks cleanly without breaking the premium aesthetic.

## 8. Infrastructure Context (Live)

### Hetzner Server: CAX21 (`vlbmx`)

- **ID:** #120524107
- **Type:** CAX21 (ARM Ampere Altra — cloud VPS, NOT dedicated AX-line)
- **IPv4:** `46.225.88.139` | **IPv6:** `2a01:4f8:1c19:5315::/64`
- **Specs:** 4 vCPU (ARM) · 8 GB RAM · 80 GB SSD · 20 TB Traffic OUT
- **Cost:** €6.99/mo
- **OS:** (To be verified on first SSH)
- **Access:** SSH via `root@46.225.88.139` (password stored securely, NEVER in code)

### Server Capacity Assessment (@hetzner-expert)

| Component               | Requirement           | CAX21 Capacity                  | Verdict      |
| ----------------------- | --------------------- | ------------------------------- | ------------ |
| Playwright instances    | ~300-500 MB each      | 8 GB total → 3-4 concurrent max | ⚠️ Tight     |
| NGINX video proxy       | ~200 MB + cache       | Fits easily                     | ✅ OK        |
| Docker overhead         | ~500 MB               | Fits                            | ✅ OK        |
| Disk for cache          | 10-20 GB ideal        | 80 GB total                     | ✅ OK        |
| Bandwidth (video proxy) | High                  | 20 TB/mo unmetered              | ✅ Excellent |
| ARM compatibility       | Playwright ARM builds | Available since v1.30+          | ✅ OK        |

**Verdict:** The CAX21 is a **solid MVP server.** It handles NGINX proxying + 2-3 concurrent Playwright scrapers comfortably. For scaling beyond 5+ simultaneous scraping jobs or heavy video proxying under load, consider upgrading to **CAX31** (8 vCPU / 16 GB) or adding a second node. The 20 TB bandwidth is excellent for video proxying.

### Scaling Plan

1. **Phase 1 (MVP):** Single CAX21 — Docker + NGINX + Playwright (2-3 instances). Sufficient for <50 concurrent viewers.
2. **Phase 2 (Growth):** Upgrade to CAX31 or add a second CAX21. Use Docker Swarm for horizontal scaling.
3. **Phase 3 (Scale):** Dedicated AX-line server (AX42) for heavy proxying + CAX fleet for scraping.

## 9. Universal Skill Index

[Expert Skills Reference]|root: C:\Users\sonig\.gemini\skills
|Essentials Pack:{concise-planning,lint-and-validate,git-pushing,kaizen,systematic-debugging,verification-before-completion,using-superpowers}
|Architecture & Cloud:{senior-architect,cloudflare-dev-expert,hetzner-expert,database-design,api-patterns,docker-expert}
|UI/UX & Frontend:{ui-ux-pro-max,frontend-design,tailwind-design-system,nextjs-app-router-patterns,mobile-design,scroll-experience}
|Scraping & Data:{browser-automation,python-pro}
|Security Pack:{ethical-hacking-methodology,burp-suite-testing,security-auditor,api-security-best-practices,auth-implementation-patterns,better-auth-best-practices,better-auth-security-best-practices,cc-skill-security-review}
|Business & Growth:{launch-strategy,seo-audit,kpi-dashboard-design,content-creator,mercadopago-expert,programmatic-seo}

## 10. Post-Mortem & Discipline ("Never Again")

> [!CAUTION]
> **CRITICAL INVARIANTS**: Every resolved critical bug MUST spawn a rule here.

- **Secrets in Chat (CRITICAL):** NEVER store or reference server passwords, API keys, or tokens in code, chat messages, or documentation. ALWAYS use secure secret managers, `.env.local` (gitignored), or `wrangler secret put`. If a password is accidentally exposed, rotate it IMMEDIATELY.
- **Playwright on ARM (CRITICAL):** ALWAYS verify Playwright ARM compatibility before deploying. Use `npx playwright install --with-deps chromium` and test with `--headed` in XVFB on ARM nodes.
- **MercadoPago Webhooks Zero-Trust (CRITICAL):** NEVER trust payload body. Extract ID → verify signature → server-to-server GET to confirm status.
- **MCP Before Build (CRITICAL):** NEVER run `npm run build`, `npm run deploy`, or `wrangler deploy` without FIRST calling at least one relevant MCP validation tool (e.g., `mcp_opennextjs_validate_configuration`, `mcp_cloudflare-docs_search`). MCP data is the MOST UP-TO-DATE source — validate BEFORE building, corroborate AFTER building. No exceptions.
- **Skills Real-Time Citation (CRITICAL):** NEVER implement without announcing the active skill in `TaskStatus` AND in the `Description` field of every code edit. Format: `"@skill-name: reason for using"`). Post-implementation citation in plan only is a VIOLATION.
- **tsconfig @/ Alias Root (CRITICAL):** ALWAYS set `"@/*": ["./src/*", "./*"]` in `tsconfig.json` paths for projects with components outside `src/`. Single `./src/*` mapping breaks `@/components` imports when the `components/` directory lives at root level.
- **Video Player playsInline (CRITICAL):** ALWAYS add `playsInline` to `<MediaPlayer>` (Vidstack) or `<video>` elements. Without it, iOS Safari forces native fullscreen on play, breaking custom player UI.
- **CSP Headers for External Media (MAJOR):** ALWAYS configure `Content-Security-Policy` in `next.config.ts` with explicit `media-src` and `connect-src` allowlists before loading any external HLS/DASH/video streams. Use `next.config.ts` `async headers()` function, NOT meta tags.
- **Typography Baseline (MAJOR):** NEVER leave `font-family: Arial` in `globals.css`. The global body font MUST use the project's Geist/Inter/Outfit font variable. The `@ui-ux-pro-max` standard mandates curated typography at ALL times.
