import { InlineKeyboard } from "grammy";
import { createTemplate } from "../../utils/createTemplate";
import type { MyContext } from "../../utils/types";
import type { MediaDetails } from "../../zodSchema";

export type UpsertOptions = {
  message: string;
  withKeyboard: boolean;
};

const keyboard = new InlineKeyboard()
  .text("◀️", "prev")
  .text("➕ Request", "request")
  .text("➡️", "next");

export class MessageService {
  private ctx: MyContext;
  private messageId: number = 0;

  constructor(ctx: MyContext) {
    this.ctx = ctx;
  }

  async upsertMessage(
    media: MediaDetails,
    options?: UpsertOptions
  ): Promise<void> {
    if (this.messageId === 0) return this.sendMessage(media);
    return this.updateMessage(media, options);
  }

  private async sendMessage(media: MediaDetails) {
    const text = createTemplate(media);
    const message = await this.ctx.replyWithPhoto(media.posterPath!, {
      caption: text,
      reply_markup: keyboard,
    });
    return this.setMessageId(message.message_id);
  }

  private async updateMessage(media: MediaDetails, options?: UpsertOptions) {
    let text = createTemplate(media);
    if (options?.message) {
      text += "\n\n" + options.message;
    }
    await this.ctx.api.editMessageMedia(
      this.ctx.chatId!,
      this.messageId,
      { media: media.posterPath!, type: "photo", caption: text },
      { reply_markup: options?.withKeyboard ? keyboard : undefined }
    );
  }

  private setMessageId(messageId: number): void {
    this.messageId = messageId;
  }

  getMessageId(): number {
    return this.messageId;
  }
}
