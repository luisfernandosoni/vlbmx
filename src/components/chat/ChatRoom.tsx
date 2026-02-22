"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface Message {
  type: "message" | "error";
  userName?: string;
  content?: string;
  message?: string;
  timestamp?: string;
}

export default function ChatRoom({ roomId }: { roomId: string }) {
  const { data: session, isPending } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/${roomId}/history`);
        if (res.ok) {
          const history = await res.json() as Omit<Message, "type">[];
          // history is ordered desc by DO, we need it asc for UI
          setMessages(history.reverse().map((msg) => ({
            type: "message",
            ...msg
          })));
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    const connect = () => {
      if (!session?.user) return; // Only connect if authenticated natively via cookies
      
      // We connect to the same-origin Next.js proxy, which forwards to the Worker.
      // This ensures cookies are sent automatically for Better Auth validation.
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/chat/${roomId}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "error") {
            setError(data.message);
          } else if (data.type === "message") {
            setMessages((prev) => [...prev, data]);
          }
        } catch (err) {
          console.error("Failed to parse message", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Simple reconnect logic (backoff should be added for production)
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setError("WebSocket connection error");
      };
    };

    if (session?.user) {
      fetchHistory().then(connect);
    }

    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [roomId, session?.user]);

  // Auto-scroll inside effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // We no longer need to pass userId/userName since the DO enforces it securely via the Auth Token attachment
    const payload = {
      type: "message",
      text: input,
    };

    wsRef.current.send(JSON.stringify(payload));
    
    // Optimistic UI Append
    setMessages((prev) => [
      ...prev,
      {
        type: "message",
        userName: session?.user?.name || "Me",
        content: input,
        timestamp: new Date().toISOString()
      }
    ]);
    setInput("");
  };

  if (isPending) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Sign In Required</h3>
        <p className="text-zinc-400 text-sm">You must be signed in to view and participate in the live chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[600px] bg-zinc-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight">Live Chat</h2>
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
            {roomId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
          <span className="text-xs font-medium text-zinc-400">
            {isConnected ? "Connected" : "Reconnecting..."}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 left-4 right-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl z-20 flex justify-between items-center backdrop-blur-md"
          >
            {error}
            <button onClick={() => setError(null)} className="opacity-70 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${msg.userName === session.user.name ? "items-end" : "items-start"}`}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-semibold ${msg.userName === session.user.name ? "text-indigo-400" : "text-zinc-400"}`}>
                {msg.userName}
              </span>
              {msg.timestamp && (
                <span className="text-[10px] text-zinc-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.userName === session.user.name 
                ? "bg-indigo-500/20 text-indigo-50 border border-indigo-500/30 rounded-tr-sm" 
                : "bg-white/5 text-zinc-200 border border-white/5 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected}
            placeholder="Send a message..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-indigo-500 flex items-center justify-center group"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
