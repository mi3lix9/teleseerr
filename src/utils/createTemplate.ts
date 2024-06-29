import type { MediaDetails } from "../zodSchema";
import type { MediaType } from "./types";

/**
 * Creates a formatted template string from the given input.
 */
export function createTemplate(input: MediaDetails): string {
  const releaseDate = "release date: " + input.releaseDate;
  return [input.title, input.overview, releaseDate, input.type].join("\n\n");
}
