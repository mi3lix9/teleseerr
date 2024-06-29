import type { components } from "../types/overseerr";
import { fetchFromJellyseerr } from "./utils/fetchFromJellyseerr";
import type { SearchResult } from "./utils/types";
import {
  MovieDetails,
  SearchInput,
  SearchOutput,
  TvDetails,
  type MediaDetails,
} from "./zodSchema";

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
        tmdbId: r.mediaInfo?.tmdbId || undefined,
        tvdbId: r.mediaInfo?.tvdbId || undefined,
      }))
  );
}

export async function request(media: MediaDetails) {
  if (media.type === "tv") {
    return await fetchFromJellyseerr("/request", {
      body: {
        mediaType: media.type,
        mediaId: media.id,
        seasons: media.seasons.map((season) => season.seasonNumber),
      },
      method: "POST",
    });
  }
  const { status } = await fetchFromJellyseerr("/request", {
    body: { mediaType: media.type, mediaId: media.id },
    method: "POST",
  });

  return status === 201;
}

export async function fetchTvDetails(id: number): Promise<TvDetails> {
  const { json: tvRaw } = await fetchFromJellyseerr<
    components["schemas"]["TvDetails"]
  >("/tv/" + id);

  const tvDetails: TvDetails = {
    type: "tv",
    id: tvRaw.id!,
    overview: tvRaw.overview!,
    title: tvRaw.name!,
    genres: tvRaw.genres?.map((genre) => genre.name!)!,
    releaseDate: tvRaw.firstAirDate!,
    lastAirDate: tvRaw.lastAirDate!,
    originalTitle: tvRaw.originalName!,
    seasons: tvRaw.seasons
      ?.filter((season) => season.seasonNumber !== 0)
      .map((season) => ({
        name: season.name!,
        airDate: season.airDate! || undefined,
        episodeCount: season.episodeCount!,
        seasonNumber: season.seasonNumber!,
      }))!,
    spokenLanguages: tvRaw.spokenLanguages![0].englishName!,
    status: tvRaw.status! as TvDetails["status"],
    posterPath: tvRaw.posterPath,
  };

  return TvDetails.parse(tvDetails);
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const { json: tvRaw } = await fetchFromJellyseerr<
    components["schemas"]["MovieDetails"]
  >("/movie/" + id);

  const movieDetails: MovieDetails = {
    type: "movie",
    id: tvRaw.id!,
    overview: tvRaw.overview!,
    title: tvRaw.title!,
    genres: tvRaw.genres?.map((genre) => genre.name!)!,
    releaseDate: tvRaw.releaseDate!,
    originalTitle: tvRaw.originalTitle!,
    spokenLanguages: tvRaw.spokenLanguages![0].englishName!,
    posterPath: tvRaw.posterPath,
  };

  return MovieDetails.parse(movieDetails);
}

export async function fetchMediaDetails(
  type: "tv" | "movie",
  id: number
): Promise<MediaDetails> {
  if (type === "movie") return await fetchMovieDetails(id);
  if (type === "tv") return await fetchTvDetails(id);

  throw new Error("Type is not correct.");
}
