import path from 'node:path';
import { config } from 'dotenv';
import Joi from 'joi';

const projectRoot = process.env.INIT_CWD ?? process.env.PWD ?? process.cwd();
config({ path: path.join(projectRoot, '.env'), quiet: true });

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_POOL_MIN: Joi.number().integer().min(0).default(2),
  DB_POOL_MAX: Joi.number().integer().min(1).default(10),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  UPLOAD_PATH: Joi.string().default('uploads/vehicles'),
}).unknown();

const { error, value } = schema.validate(process.env);
if (error) throw new Error(`Invalid environment: ${error.message}`);

export const env = value as {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_POOL_MIN: number;
  DB_POOL_MAX: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  UPLOAD_PATH: string;
};
