import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  BCRYPT_SALT_ROUND: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_EMAIL: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK: string;
  FRONTEND_URL: string;
  EXPRESS_SESSION_SECRET: string;

  //ssl commerz info
  SSL_STORE_ID: string;
  SSL_STORE_PASS: string;
  SSL_PAYMENT_API: string;
  SSL_VALIDATION_API: string;

  SSL_SUCCESS_BACKEND_URL: string;
  SSL_FAIL_BACKEND_URL: string;
  SSL_CANCEL_BACKEND_URL: string;
  SSL_SUCCESS_FRONTEND_URL: string;
  SSL_FAIL_FRONTEND_URL: string;
  SSL_CANCEL_FRONTEND_URL: string;
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
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  BCRYPT_SALT_ROUND: getEnv("BCRYPT_SALT_ROUND"),
  JWT_ACCESS_EXPIRES: getEnv("JWT_ACCESS_EXPIRES"),
  SUPER_ADMIN_EMAIL: getEnv("SUPER_ADMIN_EMAIL"),
  SUPER_ADMIN_PASSWORD: getEnv("SUPER_ADMIN_PASSWORD"),
  JWT_REFRESH_EXPIRES: getEnv("JWT_REFRESH_EXPIRES"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  EXPRESS_SESSION_SECRET: getEnv("EXPRESS_SESSION_SECRET"),
  FRONTEND_URL: getEnv("FRONTEND_URL"),
  GOOGLE_CALLBACK: getEnv("GOOGLE_CALLBACK"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  SSL_STORE_ID: getEnv("SSL_STORE_ID"),
  SSL_STORE_PASS: getEnv("SSL_STORE_PASS"),
  SSL_PAYMENT_API: getEnv("SSL_PAYMENT_API"),
  SSL_VALIDATION_API: getEnv("SSL_VALIDATION_API"),
  SSL_SUCCESS_BACKEND_URL: getEnv("SSL_SUCCESS_BACKEND_URL"),
  SSL_FAIL_BACKEND_URL: getEnv("SSL_FAIL_BACKEND_URL"),
  SSL_CANCEL_BACKEND_URL: getEnv("SSL_CANCEL_BACKEND_URL"),
  SSL_SUCCESS_FRONTEND_URL: getEnv("SSL_SUCCESS_FRONTEND_URL"),
  SSL_FAIL_FRONTEND_URL: getEnv("SSL_FAIL_FRONTEND_URL"),
  SSL_CANCEL_FRONTEND_URL: getEnv("SSL_CANCEL_FRONTEND_URL")
});

export const envVar = loadEnvVar();
