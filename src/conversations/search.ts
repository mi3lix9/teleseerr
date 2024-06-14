import { InlineKeyboard } from "grammy";
import type { components } from "../../types/overseerr";
import { fetchFromJellyseerr } from "../utils/fetchFromJellyseerr";
import { SearchInput, SearchOutput } from "../zodSchema";
import { createTemplate } from "../utils/createTemplate";
import type { MyConversation, MyContext } from "../utils/types";

const keyboard = new InlineKeyboard()
  .text("◀️", "prev")
  .text("➕ Request", "request")
  .text("➡️", "next");

/**
 * Class to handle search and navigation conversation for the Jellyseerr bot.
 */
export class SearchConversation {
  private conversation: MyConversation;
  private ctx: MyContext;
  private results: SearchOutput = [];
  private index: number = 0;
  private messageId: number = 0;
  private query: string = "";
  private page: number = 1;

  /**
   * Static method to create and run a new instance of the SearchConversation class.
   * Use it with createConversation() middleware.
   *
   * @param {MyConversation} conversation - The conversation instance.
   * @param {MyContext} ctx - The context of the conversation.
   */
  static async run(conversation: MyConversation, ctx: MyContext) {
    const searchConv = new SearchConversation(conversation, ctx);
    await searchConv.start();
  }

  constructor(conversation: MyConversation, ctx: MyContext) {
    this.conversation = conversation;
    this.ctx = ctx;
  }

  /**
   * Starts the search conversation.
   *
   * Initiates a search conversation by checking if there is a match in the context,
   * performing a search based on the query, sending the initial template, and handling
   * the results.
   */
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

  /**
   * Searches the Jellyseerr API for results.
   *
   * @param {SearchInput} input - The search input parameters.
   * @returns {Promise<SearchOutput>} A promise that resolves to the search results.
   */
  private async search(input: SearchInput): Promise<SearchOutput> {
    const parsed = SearchInput.parse(input);
    const json = await fetchFromJellyseerr("/search", parsed);

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

  /**
   * Sends the initial search result template.
   *
   * @param {SearchOutput[0]} result - The search result to be sent.
   * @returns {Promise<import("grammy").Message>} A promise that resolves to the sent message.
   */
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

  /**
   * Edits the message to show the new search result template.
   *
   * @param {SearchOutput[0]} result - The search result to be shown.
   * @returns {Promise<void>} A promise that resolves when the message is edited.
   */
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

  /**
   * Handles the results navigation and requests recursively.
   *
   * Waits for callback queries and handles navigation (prev, next) and requests.
   * Recursively calls itself to handle continuous user interaction.
   */
  private async handleResults(): Promise<void> {
    this.ctx = await this.conversation.waitForCallbackQuery([
      "prev",
      "next",
      "request",
    ]);

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
        page: this.page.toString(),
      });
      this.results = this.results.concat(newResults);
    }

    await this.editTemplate(this.results[this.index]);
    return this.handleResults(); // Recursively handle results
  }

  /**
   * Updates the index based on the action.
   *
   * @param {string | undefined} action - The action performed by the user (prev, next).
   * @param {number} index - The current index.
   * @returns {number} The updated index.
   */
  private updateIndex(action: string | undefined, index: number): number {
    if (action === "next") index++;
    if (action === "prev") index--;
    return index;
  }
}
