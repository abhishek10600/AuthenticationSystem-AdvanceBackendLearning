import { app } from "./app.js";
import { env } from "./config/env.config.js";
import { logger } from "./config/logger.js";

const port = env.PORT;

const startServer = () => {
  try {
    app.listen(port, () => {
      logger.info(`Server running on PORT: ${port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
