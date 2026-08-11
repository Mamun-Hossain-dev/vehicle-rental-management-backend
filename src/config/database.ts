import knex, { type Knex } from 'knex';
import { env } from './env.js';

const databaseConfig: Knex.Config = {
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

export const db = knex(databaseConfig);
export default databaseConfig;
