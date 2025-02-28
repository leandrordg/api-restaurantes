import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  POSTGRES_URL: z.string(),
  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);
