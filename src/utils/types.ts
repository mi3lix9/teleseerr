import type { ConversationFlavor, Conversation } from "@grammyjs/conversations";
// import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { Context } from "grammy";
import type { components } from "../../types/overseerr";

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export type MovieResult = components["schemas"]["MovieResult"];
export type TvResult = components["schemas"]["TvResult"];
export type SearchResult = MovieResult & TvResult;
