import { z } from "zod";

const envSchema = z.object({

  BOT_TOKEN: z.string({ message: "BOT_TOKEN is not defined." }),
  JELLYSEERR_URL: z.string({ message: "JELLYSEERR_URL is not defined." }).url().transform((url) =>  url + "/api/v1"),
  JELLYSEERR_KEY: z.string({ message: "JELLYSEERR_KEY is not defined." }),
});

export default envSchema.parse(process.env);

