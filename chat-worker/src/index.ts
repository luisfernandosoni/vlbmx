import { DurableObject } from "cloudflare:workers";
import { drizzle, type DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import { messages } from "./db/schema";
import migrations from "./db/migrations";

export interface Env {
  CHAT_ROOM: DurableObjectNamespace;
}

export class ChatRoom extends DurableObject {
  db: DrizzleSqliteDODatabase<typeof import("./db/schema")>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // Initialize Drizzle with the synchronous SQLite storage instance
    // Note: Type assertion used to bridge @cloudflare/workers-types and drizzle-orm
    this.db = drizzle(this.ctx.storage as any, { logger: false });
    
    // Ensure migrations run BEFORE any fetch or WebSocket events are processed
    this.ctx.blockConcurrencyWhile(async () => {
      try {
        await migrate(this.db, migrations);
      } catch (err: unknown) {
        const error = err as Error;
        if (error.message && error.message.includes("does not contain index file")) {
          // No migrations needed yet
        } else {
          console.error("Migration error:", error);
          // Retry once as seen in workersai pattern for transient DO locks
          await migrate(this.db, migrations);
        }
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/history")) {
      // Return the last 50 messages
      const history = await this.db.select().from(messages).limit(50).execute();
      return new Response(JSON.stringify(history), {
        headers: { "Content-Type": "application/json" }
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
    try {
      const data = JSON.parse(message as string);
      
      if (data.type === "message") {
        // Broadcast immediately for low latency
        const payload = JSON.stringify({
          type: "message",
          userName: data.userName,
          content: data.text,
          timestamp: new Date().toISOString()
        });

        for (const client of this.ctx.getWebSockets()) {
          client.send(payload);
        }

        // Persist to embedded SQLite asynchronously
        await this.db.insert(messages).values({
            userId: data.userId,
            userName: data.userName,
            content: data.text,
        }).execute();
      }
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid payload" }));
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    console.log(`WebSocket closed: code=${code}, reason=${reason}`);
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
