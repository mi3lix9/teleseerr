import { Bot, InlineKeyboard } from "grammy";
import type { components } from "../types/overseerr";
import env from "../env";

const { BOT_TOKEN, JELLYSEERR_KEY, JELLYSEERR_URL } = env;

const bot = new Bot(BOT_TOKEN);

bot.command("status", async (ctx) => {
  const res = await fetch(JELLYSEERR_URL + "/status");
  const json = await res.json();
  await ctx.reply(`\`\`\`JSON\n${JSON.stringify(json, null, 2)}\`\`\``, {
    parse_mode: "Markdown",
  });
});

bot.command("jellyfin", async (ctx) => {
  const res = await fetch(JELLYSEERR_URL + "/settings/jellyfin", {
    headers: { "X-Api-Key": JELLYSEERR_KEY },
  });
  const json = await res.json();
  console.log(json);
});

bot.command("search", async (ctx) => {
  const match = ctx.match;

  const [result] = await search(match);

  if (!result) return;
  const text = `📛 Name: ${result.name ?? result.title}\n
ℹ️ ${result.overview}\n
📅 Release Date: ${result.releaseDate ?? result.firstAirDate}
`;

  const keyboard = new InlineKeyboard()
    .text("◀️", "prev")
    .text("➕ Request", "request")
    .text("➡️", "next");

  if (result.posterPath)
    return await ctx.replyWithPhoto(
      "https://image.tmdb.org/t/p/original" + result.posterPath!,
      { caption: text, reply_markup: keyboard }
    );

  await ctx.reply(text, { reply_markup: keyboard });
});

bot.start();

async function search(query: string, language: string = "en") {
  const res = await fetch(
    JELLYSEERR_URL +
      "/search/?query=" +
      query +
      "&page=1" +
      "&language=" +
      language,
    {
      headers: { "X-Api-Key": JELLYSEERR_KEY! },
    }
  );
  const json = await res.json();
  return json.results as (components["schemas"]["TvResult"] &
    components["schemas"]["MovieResult"])[];
}

bot.catch(({ ctx, message }) => {
  // console.error(message);

  ctx.reply("Something went wrong.");
});
