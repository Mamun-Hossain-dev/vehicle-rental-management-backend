import knex, { type Knex } from 'knex';
import path from 'node:path';
import { env } from './env.js';

const projectRoot = process.env.INIT_CWD ?? process.env.PWD ?? process.cwd();

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
  migrations: {
    directory: path.join(projectRoot, 'database/migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(projectRoot, 'database/seeds'),
    extension: 'ts',
  },
};

export const db = knex(databaseConfig);
export default databaseConfig;
