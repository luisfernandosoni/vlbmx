import { DurableObject } from "cloudflare:workers";
import { drizzle, type DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { messages } from "./db/schema";
import migrations from "./db/migrations";

// C1: Strict input validation schema (@security-auditor)
const messageSchema = z.object({
  type: z.literal("message"),
  userId: z.string().min(1).max(128),
  userName: z.string().min(1).max(64),
  text: z.string().min(1).max(2000),
});

export interface Env {
  CHAT_ROOM: DurableObjectNamespace;
  BETTER_AUTH_URL: string;
}

// Security: Validate Bearer token or ?.token query string against Better Auth
async function validateToken(request: Request, env: Env): Promise<{ user: { id: string, name: string } } | null> {
  const url = new URL(request.url);
  let token = url.searchParams.get("token");
  
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  try {
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    
    // Pass along the cookie so HttpOnly sessions work natively for same-domain deployments
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) headers.set("Cookie", cookieHeader);

    const res = await fetch(`${env.BETTER_AUTH_URL}/api/auth/get-session`, {
      headers
    });
    if (!res.ok) return null;
    const data = await res.json() as { user?: { id: string, name: string } };
    if (!data || !data.user) return null;
    return data as { user: { id: string, name: string } };
  } catch (err) {
    console.error("Auth validation failed:", err);
    return null;
  }
}

export class ChatRoom extends DurableObject {
  db: DrizzleSqliteDODatabase<typeof import("./db/schema")>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    // H1: Auto ping/pong without waking the DO from hibernation (@cloudflare-dev-expert)
    this.ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );

    // Initialize Drizzle with the synchronous SQLite storage instance
    this.db = drizzle(this.ctx.storage, { logger: false });
    
    // Ensure migrations run BEFORE any fetch or WebSocket events are processed
    this.ctx.blockConcurrencyWhile(async () => {
      try {
        await migrate(this.db, migrations);
      } catch (err: unknown) {
        const error = err as Error;
        // H4: Swallow known safe errors, fail-fast on real issues (@senior-architect)
        if (error.message?.includes("already been applied")) return;
        if (error.message?.includes("does not contain index file")) return;
        console.error("Fatal migration error:", error);
        throw error;
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/history")) {
      // H2: Explicit ORDER BY for deterministic results (@database-design)
      const history = await this.db
        .select()
        .from(messages)
        .orderBy(desc(messages.timestamp))
        .limit(50)
        .execute();
      return new Response(JSON.stringify(history), {
        headers: {
          "Content-Type": "application/json",
          // M3: CORS for cross-origin front-end (@api-patterns)
          "Access-Control-Allow-Origin": "*",
        }
      });
    }

    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();

    // Accept the WebSocket connection with the Hibernation API
    this.ctx.acceptWebSocket(server);

    // Store the authenticated user's identity on the server WebSocket attachment
    const userId = request.headers.get("X-User-Id") || "anonymous";
    const userName = request.headers.get("X-User-Name") || "Anonymous";
    server.serializeAttachment({ userId, userName });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // C3: Explicitly reject binary frames (@systematic-debugging)
    if (typeof message !== "string") {
      ws.send(JSON.stringify({ type: "error", message: "Binary not supported" }));
      return;
    }

    try {
      const parsed = JSON.parse(message);

      // C1: Validate all client input with Zod (@security-auditor)
      const result = messageSchema.safeParse(parsed);
      if (!result.success) {
        ws.send(JSON.stringify({ type: "error", message: "Validation failed" }));
        return;
      }
      
      const attachment = ws.deserializeAttachment();
      // Enforce the backend's verified identity over the client's payload
      const userId = attachment?.userId || result.data.userId;
      const userName = attachment?.userName || result.data.userName;
      const text = result.data.text;

      // Broadcast immediately for low latency
      const payload = JSON.stringify({
        type: "message",
        userName: userName,
        content: text,
        timestamp: new Date().toISOString()
      });

      // H5: Exclude sender from broadcast — front-end renders optimistically (@api-patterns)
      for (const client of this.ctx.getWebSockets()) {
        if (client !== ws) {
          try { client.send(payload); } catch { /* stale socket, ignore */ }
        }
      }

      // Persist to embedded SQLite asynchronously
      await this.db.insert(messages).values({
        userId: userId,
        userName: userName,
        content: text,
      }).execute();
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid payload" }));
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    // C2: Complete the WebSocket close handshake per CF docs (@cloudflare-dev-expert)
    ws.close(code, reason);
  }

  async webSocketError(ws: WebSocket, error: unknown) {
    console.error("WebSocket error:", error);
  }
}

const chatWorker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Expected format: /api/chat/<room_id> or /api/chat/<room_id>/history
    if (url.pathname.startsWith('/api/chat/')) {
      // Handle preflight for CORS (if browsers fetch instead of ws connect)
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
          }
        });
      }

      // Security: Validate Auth Token natively with Better Auth Endpoint
      const auth = await validateToken(request, env);
      if (!auth) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { 
          status: 401, 
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
        });
      }

      // Reconstruct request to pass secure headers to DO
      const newRequest = new Request(request);
      newRequest.headers.set("X-User-Id", auth.user.id);
      newRequest.headers.set("X-User-Name", auth.user.name);

      const parts = url.pathname.split('/');
      const roomId = parts[3];
      
      if (!roomId) {
        return new Response('Room ID is required', { status: 400 });
      }

      const id = env.CHAT_ROOM.idFromName(roomId);
      const stub = env.CHAT_ROOM.get(id);

      return stub.fetch(newRequest);
    }

    return new Response("Not found", { status: 404 });
  }
};

export default chatWorker;
