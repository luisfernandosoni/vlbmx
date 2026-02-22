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
      const data = result.data;

      // Broadcast immediately for low latency
      const payload = JSON.stringify({
        type: "message",
        userName: data.userName,
        content: data.text,
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
        userId: data.userId,
        userName: data.userName,
        content: data.text,
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
      const parts = url.pathname.split('/');
      const roomId = parts[3];
      
      if (!roomId) {
        return new Response('Room ID is required', { status: 400 });
      }

      // Get or create the Durable Object instance for this room
      // To ensure global uniqueness per room ID, we use idFromName
      const id = env.CHAT_ROOM.idFromName(roomId);
      const stub = env.CHAT_ROOM.get(id);

      // Forward the request to the Durable Object
      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};

export default chatWorker;
