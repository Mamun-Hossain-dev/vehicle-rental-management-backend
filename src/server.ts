import { app } from './app.js';
import { db } from './config/database.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  const baseUrl = `http://localhost:${env.PORT}/api/v1`;
  console.log(`API: ${baseUrl}`);
  console.log(`API docs: ${baseUrl}/docs`);
});

const shutdown = (): void => {
  server.close(() => void db.destroy().finally(() => process.exit(0)));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
