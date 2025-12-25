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

interface Env {
  DEVELOPMENT: boolean;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  AUTH_PREFIX: string;
  AUTH_HEADER_NAME: string;
}

const env: Env = {
  DEVELOPMENT: false,
  DATABASE_HOST: "",
  DATABASE_PORT: 0,
  DATABASE_USER: "",
  DATABASE_PASSWORD: "",
  DATABASE_NAME: "",
  AUTH_PREFIX: "",
  AUTH_HEADER_NAME: "",
};

function setEnv(development: boolean, runEnv: Record<string, string>) {
  env.DEVELOPMENT = development;
  env.DATABASE_HOST = runEnv.DATABASE_HOST || "";
  env.DATABASE_PORT = Number(runEnv.DATABASE_PORT || "3306");
  env.DATABASE_USER = runEnv.DATABASE_USER || "";
  env.DATABASE_PASSWORD = runEnv.DATABASE_PASSWORD || "";
  env.DATABASE_NAME = runEnv.DATABASE_NAME || "";
  env.AUTH_PREFIX = runEnv.AUTH_PREFIX || "Bearer";
  env.AUTH_HEADER_NAME = runEnv.AUTH_HEADER_NAME || "Authorization";
}

await loadEnv();

export { env };
