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

export const TvDetails = z.object({
  id: z.number(),
  title: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  firstAirDate: z.string().optional(),
  genres: z.array(z.string()),
  lastAirDate: z.string(),
  // spokenLanguages: z.string(),
  seasons: z.array(
    z.object({
      airDate: z.string().optional(),
      episodeCount: z.number(),
      name: z.string(),
      seasonNumber: z.number(),
    })
  ),
});

export type SearchOutput = z.infer<typeof SearchOutput>;

export type SearchInput = z.infer<typeof SearchInput>;

export type TvDetails = z.infer<typeof TvDetails>;
