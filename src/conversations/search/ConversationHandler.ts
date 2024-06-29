import { request } from "../../jellyseerr";
import type { MyConversation, MyContext } from "../../utils/types";
import { MessageService, type UpsertOptions } from "./MessageService";
import { SearchService } from "./SearchService";

export class SearchConversation {
  private conversation: MyConversation;
  private ctx: MyContext;
  private searchService: SearchService;
  private messageService: MessageService;
  private index: number = 0;

  constructor(conversation: MyConversation, ctx: MyContext, query: string) {
    this.conversation = conversation;
    this.ctx = ctx;
    this.searchService = new SearchService(query);
    this.messageService = new MessageService(ctx);
  }

  static async run(conversation: MyConversation, ctx: MyContext) {
    if (!ctx.match) {
      return await ctx.reply(
        "You should write /search [show|movie title].\nFor example: /search One Piece"
      );
    }

    const handler = new SearchConversation(
      conversation,
      ctx,
      ctx.match as string
    );
    await handler.start();
  }

  async start() {
    await this.searchService.search();
    await this.updateMessage();
    await this.handleResults();
  }

  private async updateMessage(options?: UpsertOptions) {
    const media = await this.searchService.fetchMediaDetails(this.index);
    const message = await this.messageService.upsertMessage(media, options);
  }

  private async handleResults(): Promise<void> {
    this.ctx = await this.conversation.waitForCallbackQuery([
      "prev",
      "next",
      "request",
    ]);

    if (this.ctx.callbackQuery?.data === "request") {
      const media = await this.searchService.fetchMediaDetails(this.index);
      const ok = await request(media);

      if (ok) {
        await this.updateMessage({
          message: "Requested!",
          withKeyboard: false,
        });
        // await this.ctx.api.deleteMessage(
        //   this.ctx.chatId!,
        //   this.messageService.getMessageId()
        // );
        // await this.ctx.reply("Requested!");
        return;
      }

      await this.ctx.reply("Something wrong happened");
      return;
    }

    this.index = this.updateIndex(this.ctx.callbackQuery?.data, this.index);

    if (this.index < 0) {
      this.index = 0;
      await this.ctx.answerCallbackQuery("You cannot go back more!");
    } else if (this.index >= this.searchService.getResults().length) {
      await this.searchService.fetchNextPage();
    }

    await this.updateMessage();
    return this.handleResults(); // Recursively handle results
  }

  private updateIndex(action: string | undefined, index: number): number {
    if (action === "next") index++;
    if (action === "prev") index--;
    return index;
  }
}
