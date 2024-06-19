import { webhookCallback } from "grammy";
import { Hono } from "hono";
import { bot } from "./bot";
import env from "~/env";

const app = new Hono();

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(webhookCallback(bot, "hono"));
} else {
  bot.start({
    onStart: (info) =>
      console.log("Bot started as https://t.me/" + info.username),
  });
}

app.get("/", (c) => c.text("Hello Bun!"));

export default app;
