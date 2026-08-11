import { app } from './app.js';
import { db } from './config/database.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () =>
  console.log(`API listening on port ${env.PORT}`),
);

const shutdown = (): void => {
  server.close(() => void db.destroy().finally(() => process.exit(0)));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
