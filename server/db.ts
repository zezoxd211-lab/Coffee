import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// DATABASE_URL is optional - if not set, the app uses in-memory storage
export const db = process.env.DATABASE_URL
  ? drizzle(new pg.Pool({ connectionString: process.env.DATABASE_URL }), { schema })
  : null;
