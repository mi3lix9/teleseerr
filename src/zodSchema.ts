import { z } from "zod";

export const SearchInput = z.object({
  query: z.string(),
  language: z.string().optional(),
  page: z.number().or(z.string()).default(1).transform(String).optional(),
});

export const SearchOutput = z.array(
  z.object({
    id: z.string().or(z.number()),
    tvdbId: z.string().or(z.number()).optional(),
    tmdbId: z.string().or(z.number()).optional(),
    title: z.string(),
    overview: z.string().optional(),
    releaseDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    posterPath: z
      .string()
      .optional()
      .transform((val) => "https://image.tmdb.org/t/p/original" + val),
    mediaType: z.enum(["movie", "tv"]),
  })
);

export type SearchOutput = z.infer<typeof SearchOutput>;

export type SearchInput = z.infer<typeof SearchInput>;
