import type { Knex } from 'knex';
import { env } from './src/config/env.js';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  pool: { min: env.DB_POOL_MIN, max: env.DB_POOL_MAX },
  migrations: { directory: './database/migrations', extension: 'ts' },
  seeds: { directory: './database/seeds', extension: 'ts' },
};

export default config;
