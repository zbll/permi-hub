import type { Context, MiddlewareHandler } from "hono";
import { bearerAuth } from "hono/bearer-auth";

export type AuthOptions = {
  prefix?: string;
  headerName?: string;
  verifyToken?: (token: string, ctx: Context) => Promise<boolean>;
};

export function auth(options?: AuthOptions): MiddlewareHandler {
  return bearerAuth({
    prefix: options?.prefix,
    headerName: options?.headerName,
    verifyToken: async (token, ctx) => {
      if (!options?.verifyToken) return false;
      return await options.verifyToken(token, ctx);
    },
  });
}
