import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../src/db";

export function getAuth() {
  const db = getDb();
  const isProd = process.env.NODE_ENV === "production";
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      }
    },
    rateLimit: {
      enabled: isProd, // Enable rate limiting in production
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Refresh token every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 300, 
        strategy: "compact" // Faster, smaller edge cache
      }
    },
    advanced: {
      useSecureCookies: isProd,
      // Pass platform-specific async handler wrapper for Edge runtime timing-attack prevention
      backgroundTasks: {
        handler: (promise) => {
          try {
            if (typeof (globalThis as unknown as Record<string, unknown>).waitUntil === "function") {
              const gt = globalThis as unknown as { waitUntil: (p: Promise<unknown>) => void };
              gt.waitUntil(promise);
            }
          } catch {
            // Fallback
          }
        }
      }
    }
  });
}
