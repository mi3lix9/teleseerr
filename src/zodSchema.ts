import { array, z } from "zod";

export const SearchInput = z.object({
  query: z.string(),
  language: z.string().optional(),
  page: z.number().or(z.string()).default(1).transform(String).optional(),
});

export const SearchOutput = z.array(
  z.object({
    mediaId: z.number(),
    tvdbId: z.number().optional(),
    tmdbId: z.number().optional(),
    title: z.string(),
    overview: z.string().optional(),
    releaseDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    posterPath: z
      .string()
      .or(z.null())
      .optional()
      .transform((val) =>
        typeof val === "string"
          ? "https://image.tmdb.org/t/p/original" + val
          : undefined
      ),
    mediaType: z.enum(["movie", "tv"]),
  })
);

const TvSeason = z.object({
  airDate: z.string().optional(),
  episodeCount: z.number(),
  name: z.string(),
  seasonNumber: z.number(),
});

export const TvDetails = z.object({
  type: z.literal("tv").default("tv"),
  id: z.number(),
  title: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  releaseDate: z.string().optional(),
  genres: z.array(z.string()),
  lastAirDate: z.string(),
  spokenLanguages: z.string().optional(),
  seasons: z.array(TvSeason),
  status: z.enum(["Ended", "Returning Series"]),
  posterPath: z
    .string()
    .transform((val) =>
      typeof val === "string"
        ? "https://image.tmdb.org/t/p/original" + val
        : undefined
    ),
});

export const MovieDetails = z.object({
  type: z.literal("movie").default("movie"),
  id: z.number(),
  title: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  releaseDate: z.string().optional(),
  genres: z.array(z.string()),
  spokenLanguages: z.string().optional(),
  posterPath: z
    .string()
    .transform((val) =>
      typeof val === "string"
        ? "https://image.tmdb.org/t/p/original" + val
        : undefined
    ),
});

const MediaDetails = z.union([MovieDetails, TvDetails]);

export type SearchOutput = z.infer<typeof SearchOutput>;

export type SearchInput = z.infer<typeof SearchInput>;

export type TvDetails = z.infer<typeof TvDetails>;
export type MovieDetails = z.infer<typeof MovieDetails>;
export type MediaDetails = z.infer<typeof MediaDetails>;
