import { search, fetchMediaDetails } from "../../jellyseerr";
import type { SearchOutput, MediaDetails } from "../../zodSchema";

export class SearchService {
  private query: string;
  private page: number = 1;
  private results: SearchOutput = [];

  constructor(query: string) {
    this.query = query;
  }

  async search(): Promise<void> {
    const results = await search({ query: this.query });
    this.updateResults(results);
  }

  async fetchNextPage(): Promise<void> {
    this.page++;
    const newResults = await search({
      query: this.query,
      page: this.page.toString(),
    });
    this.updateResults(this.results.concat(newResults));
  }

  getResults(): SearchOutput {
    return this.results;
  }

  async fetchMediaDetails(index: number): Promise<MediaDetails> {
    const result = this.results[index];
    return await fetchMediaDetails(result.mediaType, result.mediaId);
  }

  private updateResults(results: SearchOutput): void {
    this.results = results.filter((res) => !!res.posterPath);
  }
}
