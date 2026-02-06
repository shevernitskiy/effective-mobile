import { app } from "./app.js";
import { config } from "./config/index.js";
import { runMigrations } from "./database/migrate.js";
import { logger } from "./lib/logger.js";

try {
  await runMigrations();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
} catch (error) {
  logger.fatal(error);
  process.exit(1);
}
