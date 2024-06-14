import { InlineKeyboard } from "grammy";
import env from "../../env";
import type { components } from "../../types/overseerr";
import type { MyContext, MyConversation } from "..";
import { z } from "zod";

const { JELLYSEERR_KEY, JELLYSEERR_URL } = env;

const keyboard = new InlineKeyboard()
  .text("◀️", "prev")
  .text("➕ Request", "request")
  .text("➡️", "next");

export class SearchConversation {
  private conversation: MyConversation;
  private ctx: MyContext;
  private results: SearchOutput = [];
  private index: number = 0;
  private messageId: number = 0;
  private query: string = "";
  private page: number = 1;

  static async run(conversation: MyConversation, ctx: MyContext) {
    const searchConv = new SearchConversation(conversation, ctx);
    await searchConv.start();
  }

  constructor(conversation: MyConversation, ctx: MyContext) {
    this.conversation = conversation;
    this.ctx = ctx;
  }

  // Start the search conversation
  async start() {
    if (!this.ctx.match) {
      return await this.ctx.reply(
        "You should write /search [show|movie title].\nFor example: /search One Piece"
      );
    }

    this.query = this.ctx.match as string;
    this.results = await this.search({ query: this.query });

    const message = await this.sendTemplate(this.results[0]);
    this.messageId = message.message_id;

    await this.handleResults();
  }

  // Search the Jellyseerr API for results
  private async search(
    input: z.infer<typeof SearchInput>
  ): Promise<SearchOutput> {
    const parsed = SearchInput.parse(input);
    const url = new URL(JELLYSEERR_URL + "/search");

    Object.entries(parsed).forEach(([key, val]) =>
      url.searchParams.append(key, encodeURIComponent(val))
    );

    const res = await fetch(url.toString(), {
      headers: { "X-Api-Key": JELLYSEERR_KEY! },
    });
    const json = await res.json();
    const results = json.results as (components["schemas"]["TvResult"] &
      components["schemas"]["MovieResult"])[];

    return SearchOutput.parse(
      results.map((r) => ({
        title: r.title ?? r.name,
        overview: r.overview ?? "",
        releaseDate: r.releaseDate ?? r.firstAirDate,
        posterPath: r.posterPath ?? "",
      }))
    );
  }

  // Send the initial search result template
  private async sendTemplate(result: SearchOutput[0]) {
    const text = createTemplate({
      title: result.title,
      overview: result.overview ?? "",
      releaseDate: result.releaseDate ?? "",
    });

    if (result.posterPath) {
      return await this.ctx.replyWithPhoto(result.posterPath, {
        caption: text,
        reply_markup: keyboard,
      });
    }

    return await this.ctx.reply(text, { reply_markup: keyboard });
  }

  // Edit the message to show the new search result template
  private async editTemplate(result: SearchOutput[0]) {
    const text = createTemplate({
      title: result.title,
      overview: result.overview ?? "",
      releaseDate: result.releaseDate ?? "",
    });

    if (result.posterPath) {
      return await this.ctx.api.editMessageMedia(
        this.ctx.chatId!,
        this.messageId,
        { media: result.posterPath, type: "photo", caption: text },
        { reply_markup: keyboard }
      );
    }

    return await this.ctx.api.editMessageText(
      this.ctx.chatId!,
      this.messageId,
      text,
      {
        reply_markup: keyboard,
      }
    );
  }

  // Handle the results navigation and requests recursively
  private async handleResults(): Promise<void> {
    this.ctx = await this.conversation.waitForCallbackQuery([
      "prev",
      "next",
      "request",
    ]);
    await this.ctx.answerCallbackQuery();

    if (this.ctx.callbackQuery?.data === "request") {
      this.ctx.api.deleteMessage(this.ctx.chatId!, this.messageId);
      return;
    }

    this.index = this.updateIndex(this.ctx.callbackQuery?.data, this.index);

    if (this.index < 0) {
      this.index = 0;
      await this.ctx.answerCallbackQuery("You cannot go back more!");
      return this.handleResults(); // Recursively handle results
    }

    if (this.index >= this.results.length) {
      this.page++;
      const newResults = await this.search({
        query: this.query,
        page: this.page,
      });
      this.results = this.results.concat(newResults);
    }

    await this.editTemplate(this.results[this.index]);
    return this.handleResults(); // Recursively handle results
  }

  // Update the index based on the action
  private updateIndex(action: string | undefined, index: number): number {
    if (action === "next") index++;
    if (action === "prev") index--;
    return index;
  }
}

const SearchInput = z.object({
  query: z.string(),
  language: z.string().optional(),
  page: z.number().or(z.string()).default(1).transform(String).optional(),
});

const SearchOutput = z.array(
  z.object({
    title: z.string(),
    overview: z.string().optional(),
    releaseDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    posterPath: z
      .string()
      .optional()
      .transform((val) => "https://image.tmdb.org/t/p/original" + val),
  })
);

type SearchOutput = z.infer<typeof SearchOutput>;

type TemplateInput = {
  title: string;
  overview: string;
  releaseDate: string;
};

function createTemplate(input: TemplateInput) {
  const releaseDate = "release date: " + input.releaseDate;
  return [input.title, input.overview, releaseDate].join("\n\n");
}
