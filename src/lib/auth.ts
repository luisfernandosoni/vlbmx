import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, bearer } from "better-auth/plugins";
import { getDb } from "@/db";

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    // C1 FIX: socialProviders MUST be configured for signIn.social() to work
    // @auth-implementation-patterns @better-auth-best-practices
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      },
    },
    plugins: [
      apiKey(), // Allows server-to-server auth using an API key
      bearer(), // Allows validating Bearer tokens in headers
    ],
  });
}
