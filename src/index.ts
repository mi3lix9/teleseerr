import { Bot, session } from "grammy";
import env from "../env";
import { conversations, createConversation } from "@grammyjs/conversations";
import { SearchConversation } from "./conversations/search";
import type { MyContext } from "./utils/types";
import { COMMANDS } from "./utils/commands";
import { inlineQueryHandler } from "./utils/inlineQueryHandler";

const { BOT_TOKEN } = env;

const bot = new Bot<MyContext>(BOT_TOKEN);

bot.inlineQuery(/.*/, inlineQueryHandler);

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

bot.command(["start"], async (ctx) => {
  await ctx.reply("Hello!");
  await ctx.api.setMyCommands(COMMANDS);
});

bot.use(createConversation(SearchConversation.run, "searchConversation"));

bot.command("search", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.conversation.enter("searchConversation");
});

bot.start({
  onStart: (info) =>
    console.log("Bot started as https://t.me/" + info.username),
});

bot.catch(({ ctx, message }) => {
  console.error(message);

  ctx.reply("Something went wrong.");
});
