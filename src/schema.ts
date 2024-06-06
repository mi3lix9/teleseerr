import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


// Note: This code was just for test, we need to create the schema later.
export const users = sqliteTable("users", {
  telegram_id: integer("id").primaryKey(),
  jellyfin_id: text("name"),
});