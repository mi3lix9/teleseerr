import type { ConversationFlavor, Conversation } from "@grammyjs/conversations";
// import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { Context } from "grammy";

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;
