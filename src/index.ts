import { Bot, Context, InlineKeyboard, session } from "grammy";
import type { components } from "../types/overseerr";
import env from "../env";
import {
  conversations,
  createConversation,
  type Conversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import type { HydrateFlavor } from "@grammyjs/hydrate";
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

// bot.command("status", async (ctx) => {
//   const res = await fetch(JELLYSEERR_URL + "/status");
//   const json = await res.json();
//   await ctx.reply(`\`\`\`JSON\n${JSON.stringify(json, null, 2)}\`\`\``, {
//     parse_mode: "Markdown",
//   });
// });

// bot.command("jellyfin", async (ctx) => {
//   const res = await fetch(JELLYSEERR_URL + "/settings/jellyfin", {
//     headers: { "X-Api-Key": JELLYSEERR_KEY },
//   });
//   const json = await res.json();
//   console.log(json);
// });

// bot.command("search", async (ctx) => {});

bot.start();

bot.catch(({ ctx, message }) => {
  console.error(message);

  ctx.reply("Something went wrong.");
});
