import type { InlineQueryResultArticle } from "grammy/types";
import { search } from "app:jellyseerr";
import { createTemplate } from "./createTemplate";
import type { MyContext } from "./types";
import type { Filter } from "grammy";

export async function inlineQueryHandler(
  ctx: Filter<MyContext, "inline_query">
) {
  const query = ctx.inlineQuery.query.trim();

  if (query === "") {
    return; // Ignore empty queries
  }

  const results = await search({ query });

  // Format the results to send as inline query answers
  const inlineResults: InlineQueryResultArticle[] = results
    .filter((result) => typeof result.posterPath !== "undefined")
    .map((result) => ({
      type: "article",
      id: String(result.mediaId),
      title: result.mediaType + ": " + result.title,
      input_message_content: {
        message_text: createTemplate({
          title: result.title,
          overview: result.overview ?? "",
          releaseDate: result.releaseDate ?? "",
          mediaType: result.mediaType,
        }),
      },
      description: result.overview,
      thumb_url: result.posterPath,
    }));

  // Answer the inline query
  await ctx.answerInlineQuery(inlineResults);
}
