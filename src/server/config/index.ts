import * as dotenv from "dotenv";

dotenv.config();

const _requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getEnv = (name: string, defaultValue: string = ""): string => {
  return process.env[name] || defaultValue;
};

interface Config {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  database: {
    url: string;
  };
  security: {
    rateLimitWindowMs: number;
    rateLimitMax: number;
  };
  cors: {
    origin: string;
  };
}

const config: Config = {
  port: parseInt(getEnv("PORT", "8080"), 10),
  nodeEnv: getEnv("NODE_ENV", "development"),
  isDevelopment: getEnv("NODE_ENV", "development") === "development",
  isProduction: getEnv("NODE_ENV") === "production",
  isTest: getEnv("NODE_ENV") === "test",
  database: {
    url: getEnv("DATABASE_URL"),
  },
  security: {
    rateLimitWindowMs: 15 * 60 * 1000,
    rateLimitMax: 100,
  },
  cors: {
    origin: getEnv("CORS_ORIGIN", "*"),
  },
};

export default config;
