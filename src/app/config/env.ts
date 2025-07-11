import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET:string;
  JWT_ACCESS_EXPIRES:string;
  BCRYPT_SALT_ROUND:string;
  SUPER_ADMIN_PASSWORD:string;
  SUPER_ADMIN_EMAIL:string;
}

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

const loadEnvVar = (): EnvConfig => ({
  PORT: getEnv("PORT"),
  DB_URL: getEnv("DB_URL"),
  NODE_ENV: getEnv("NODE_ENV") as "development" | "production",
  JWT_ACCESS_SECRET:getEnv("JWT_ACCESS_SECRET"),
  BCRYPT_SALT_ROUND:getEnv("BCRYPT_SALT_ROUND"),
  JWT_ACCESS_EXPIRES:getEnv("JWT_ACCESS_EXPIRES"),
  SUPER_ADMIN_EMAIL:getEnv("SUPER_ADMIN_EMAIL"),
  SUPER_ADMIN_PASSWORD:getEnv("SUPER_ADMIN_PASSWORD")
});

export const envVar = loadEnvVar();
