import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    userName: text("user_name").notNull(),
    content: text("content").notNull(),
    timestamp: text("timestamp").notNull().$defaultFn(() => new Date().toISOString()),
});
