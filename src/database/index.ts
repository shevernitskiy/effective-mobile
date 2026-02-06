import { drizzle } from "drizzle-orm/node-postgres";

import { config } from "../config/index.js";

export const db = drizzle(config.db.url);
