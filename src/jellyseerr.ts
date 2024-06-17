import { fetchFromJellyseerr } from "./utils/fetchFromJellyseerr";
import type { MediaType, SearchResult } from "./utils/types";
import { SearchInput, SearchOutput } from "./zodSchema";

/**
 * Searches the Jellyseerr API for results.
 *
 * @param {SearchInput} input - The search input parameters.
 * @returns {Promise<SearchOutput>} A promise that resolves to the search results.
 */
export async function search(input: SearchInput): Promise<SearchOutput> {
  const parsed = SearchInput.parse(input);
  const { json } = await fetchFromJellyseerr("/search", { params: parsed });

  const results = json.results as SearchResult[];

  return SearchOutput.parse(
    results
      .filter((res) => res.mediaType !== "person")
      .map((r: SearchResult) => ({
        mediaId: r.id,
        title: r.title || r.name,
        overview: r.overview,
        releaseDate: r.releaseDate ?? r.firstAirDate,
        posterPath: r.posterPath,
        mediaType: r.mediaType,
      }))
  );
}

export async function request(mediaType: MediaType, mediaId: number) {
  const { status } = await fetchFromJellyseerr("/request", {
    body: { mediaType, mediaId },
    method: "POST",
  });

  return status === 201;
}
