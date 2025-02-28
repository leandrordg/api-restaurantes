import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env";
import { reservations, tables, users } from "./schema";

const pg = postgres(env.POSTGRES_URL);
const db = drizzle(pg, {
  schema: {
    users,
    tables,
    reservations,
  },
});

export { db, pg };
