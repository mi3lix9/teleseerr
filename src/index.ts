
import { Bot } from "grammy";

const BOT_TOKEN = process.env.BOT_TOKEN
const JELLYSEERR_URL = process.env.JELLYSEERR_URL
const JELLYSEERR_KEY = process.env.JELLYSEERR_KEY

if (typeof BOT_TOKEN === "undefined") {
  throw new Error("BOT_TOKEN is not defined.")
}

if (typeof JELLYSEERR_URL === "undefined") {
  throw new Error("JELLYSEERR_URL is not defined.")
}

if (typeof JELLYSEERR_KEY === "undefined") {
  throw new Error("JELLYSEERR_KEY is not defined.")
}



const bot = new Bot(BOT_TOKEN);

// Reply to any message with "Hi there!".
// bot.on("message", (ctx) => ctx.reply("Hi there!"));

bot.command("status", async (ctx) => {
  const res = await fetch(JELLYSEERR_URL + "/status")
  const json = await res.json();
  await ctx.reply(`\`\`\`JSON\n${JSON.stringify(json, null, 2)}\`\`\``, { parse_mode: "Markdown" })

})

bot.start();