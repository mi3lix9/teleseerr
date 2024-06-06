
import { Bot } from "grammy";

const BOT_TOKEN = process.env.BOT_TOKEN

if (typeof BOT_TOKEN === "undefined") {
  throw new Error("BOT_TOKEN is not defined.")
}

const bot = new Bot(BOT_TOKEN); // <-- put your bot token between the "" (https://t.me/BotFather)

// Reply to any message with "Hi there!".
bot.on("message", (ctx) => ctx.reply("Hi there!"));

bot.start();