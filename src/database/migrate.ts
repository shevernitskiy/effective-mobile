import { migrate } from "drizzle-orm/node-postgres/migrator";

import { logger } from "../lib/logger.js";
import { db } from "./index.js";

export async function runMigrations(): Promise<void> {
  logger.debug("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  logger.debug("Migrations completed!");
}
