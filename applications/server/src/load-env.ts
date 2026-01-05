import { load } from "@std/dotenv";

function getEnvFileName(development: boolean): string {
  return development ? ".env.development" : ".env.product";
}

/**
 * 加载环境变量
 */
async function loadEnv() {
  const env = await load({
    envPath: ".env",
  });
  const development = env.DEVELOPMENT === "true";
  const envFileName = getEnvFileName(development);
  const runEnv = await load({
    envPath: envFileName,
  });
  setEnv(development, runEnv);
}

export interface Env {
  DEVELOPMENT: boolean;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  PORT: number;
  AUTH_PREFIX: string;
  AUTH_HEADER_NAME: string;
  MAX_USER_LOGIN_COUNT: number;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  MAILER_BASE_HOSTNAME: string;
  MAILER_BASE_PORT: number;
  MAILER_BASE_TLS: boolean;
  MAILER_BASE_USERNAME: string;
  MAILER_BASE_PASSWORD: string;
}

const env: Env = {
  DEVELOPMENT: false,
  DATABASE_HOST: "",
  DATABASE_PORT: 0,
  DATABASE_USER: "",
  DATABASE_PASSWORD: "",
  DATABASE_NAME: "",
  PORT: 0,
  AUTH_PREFIX: "",
  AUTH_HEADER_NAME: "",
  MAX_USER_LOGIN_COUNT: 0,
  ADMIN_EMAIL: "",
  ADMIN_PASSWORD: "",
  MAILER_BASE_HOSTNAME: "",
  MAILER_BASE_PORT: 0,
  MAILER_BASE_TLS: false,
  MAILER_BASE_USERNAME: "",
  MAILER_BASE_PASSWORD: "",
};

function setEnv(development: boolean, runEnv: Record<string, string>) {
  env.DEVELOPMENT = development;
  env.DATABASE_HOST = runEnv.DATABASE_HOST || "";
  env.DATABASE_PORT = Number(runEnv.DATABASE_PORT || "3306");
  env.DATABASE_USER = runEnv.DATABASE_USER || "";
  env.DATABASE_PASSWORD = runEnv.DATABASE_PASSWORD || "";
  env.DATABASE_NAME = runEnv.DATABASE_NAME || "";
  env.PORT = Number(runEnv.PORT || "8080");
  env.AUTH_PREFIX = runEnv.AUTH_PREFIX || "Bearer";
  env.AUTH_HEADER_NAME = runEnv.AUTH_HEADER_NAME || "Authorization";
  env.MAX_USER_LOGIN_COUNT = Number(runEnv.MAX_USER_LOGIN_COUNT || "1");
  env.ADMIN_EMAIL = runEnv.ADMIN_EMAIL || "";
  env.ADMIN_PASSWORD = runEnv.ADMIN_PASSWORD || "";
  env.MAILER_BASE_HOSTNAME = runEnv.MAILER_BASE_HOSTNAME || "";
  env.MAILER_BASE_PORT = Number(runEnv.MAILER_BASE_PORT || "465");
  env.MAILER_BASE_TLS = runEnv.MAILER_BASE_TLS === "true";
  env.MAILER_BASE_USERNAME = runEnv.MAILER_BASE_USERNAME || "";
  env.MAILER_BASE_PASSWORD = runEnv.MAILER_BASE_PASSWORD || "";
}

await loadEnv();

export { env };
