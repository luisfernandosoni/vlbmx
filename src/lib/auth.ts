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
    plugins: [
      apiKey(), // Allows server-to-server auth using an API key
      bearer(), // Allows validating Bearer tokens in headers
    ],
  });
}
