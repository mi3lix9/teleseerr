import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: "turso",
  dbCredentials: {
    url: "file:./sqlite.db",

  }
});
