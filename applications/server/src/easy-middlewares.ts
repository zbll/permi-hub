import { auth, AuthError } from "@packages/middlewares";
import { env } from "~env";
import { UserService } from "./services/user/UserService.ts";
import type { User } from "~entity/User.ts";
import type { Context } from "hono";
import { cache } from "hono/cache";
import { usePatience } from "@packages/hooks";
import { verifyToken } from "@packages/token";
import { i18n } from "~locale";

export type AuthVar = {
  user: User;
};

export function useAuth() {
  return auth({
    prefix: env.AUTH_PREFIX,
    headerName: env.AUTH_HEADER_NAME,
    verifyToken: async (token, ctx: Context<{ Variables: AuthVar }>) => {
      const [isValid] = await usePatience(verifyToken(token));
      if (!isValid) throw new AuthError(i18n.t("token.invalid"));
      const [success, user] = await usePatience(UserService.fromToken(token));
      if (!success) throw new AuthError(i18n.t("token.invalid"));
      ctx.set("user", user);
      return true;
    },
  });
}

export function useCache() {
  return cache({
    cacheName: "global-cache",
    cacheControl: "max-age=60",
    wait: true,
  });
}
