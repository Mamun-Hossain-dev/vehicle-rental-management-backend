import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const integer = (name: string, fallback: number, min: number): number => {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min) throw new Error(`Invalid environment variable: ${name}`);
  return value;
};

const nodeEnv = process.env.NODE_ENV ?? 'development';
if (!['development', 'test', 'production'].includes(nodeEnv)) throw new Error('Invalid environment variable: NODE_ENV');
const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');

export const env: {
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
} = {
  NODE_ENV: nodeEnv as 'development' | 'test' | 'production',
  PORT: integer('PORT', 3000, 1),
  DB_HOST: required('DB_HOST'),
  DB_PORT: integer('DB_PORT', 5432, 1),
  DB_NAME: required('DB_NAME'),
  DB_USER: required('DB_USER'),
  DB_PASSWORD: required('DB_PASSWORD'),
  DB_POOL_MIN: integer('DB_POOL_MIN', 2, 0),
  DB_POOL_MAX: integer('DB_POOL_MAX', 10, 1),
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  UPLOAD_PATH: process.env.UPLOAD_PATH ?? 'uploads/vehicles',
};
