import { Bot, session } from "grammy";
import env from "../env";
import { conversations, createConversation } from "@grammyjs/conversations";
import { SearchConversation } from "./conversations/search";
import type { MyContext } from "./utils/types";

const { BOT_TOKEN } = env;

const bot = new Bot<MyContext>(BOT_TOKEN);

// Install the session plugin.
bot.use(
  session({
    initial() {
      // return empty object for now
      return {};
    },
  })
);

// Install the conversations plugin.
bot.use(conversations());

bot.command(["start"], (ctx) => ctx.reply("Hello!"));

bot.use(createConversation(SearchConversation.run, "searchConversation"));

bot.command("search", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.conversation.enter("searchConversation");
});

bot.start();

bot.catch(({ ctx, message }) => {
  console.error(message);

  ctx.reply("Something went wrong.");
});
