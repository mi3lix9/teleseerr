import { InlineKeyboard } from "grammy";
import { createTemplate } from "../../utils/createTemplate";
import type { MyContext } from "../../utils/types";
import type { MediaDetails } from "../../zodSchema";
import type { Message } from "grammy/types";

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

  async sendTemplate(media: MediaDetails): Promise<void> {
    const text = createTemplate(media);

    if (this.messageId === 0) {
      const message = await this.ctx.replyWithPhoto(media.posterPath!, {
        caption: text,
        reply_markup: keyboard,
      });
      return this.setMessageId(message.message_id);
    }

    await this.ctx.api.editMessageMedia(
      this.ctx.chatId!,
      this.messageId,
      { media: media.posterPath!, type: "photo", caption: text },
      { reply_markup: keyboard }
    );
  }

  async editTemplate(media: MediaDetails): Promise<void> {
    const text = createTemplate(media);

    if (media.posterPath) {
      await this.ctx.api.editMessageMedia(
        this.ctx.chatId!,
        this.messageId,
        { media: media.posterPath, type: "photo", caption: text },
        { reply_markup: keyboard }
      );
    } else {
      await this.ctx.api.editMessageText(
        this.ctx.chatId!,
        this.messageId,
        text,
        {
          reply_markup: keyboard,
        }
      );
    }
  }

  setMessageId(messageId: number): void {
    this.messageId = messageId;
  }

  getMessageId(): number {
    return this.messageId;
  }
}
