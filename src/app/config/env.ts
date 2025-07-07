import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
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
});

export const envVar = loadEnvVar();
