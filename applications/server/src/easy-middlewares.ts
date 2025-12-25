import { auth, AuthError } from "@packages/middlewares";
import { env } from "~env";
import { UserService } from "./services/user/UserService.ts";
import type { User } from "~entity/User.ts";
import type { Context } from "hono";
import { cache } from "hono/cache";
import { usePatience } from "@packages/hooks";
import { verifyToken } from "@packages/token";
import { i18n } from "~locale";
import type { MiddlewareHandler } from "hono";
import { Permissions } from "~permission";

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

/**
 * 检查用户是否有足够的权限
 * @param aPermission 用户权限
 * @param bPermission 需要的权限
 * @returns 是否有足够的权限
 * @example
 * checkPermission("admin", "admin") // true
 * checkPermission("user", "admin") // false
 * checkPermission("user", "user:read") // true
 * checkPermission("user:read", "user:write") // false
 * checkPermission("user:permission", "user:permission:read") // true
 */
function checkPermission(aPermission: string, bPermission: string): boolean {
  return aPermission === bPermission || bPermission.startsWith(aPermission);
}

/**
 * 检查用户是否有足够的权限
 * @param needPermissions 需要的权限列表
 * @returns 中间件处理函数
 */
export function usePermission(needPermissions: string[]): MiddlewareHandler {
  return async (ctx: Context<{ Variables: AuthVar }>, next) => {
    const user = ctx.var.user;
    const { permissions } = user;
    if (permissions.some((u) => u.permission === Permissions.Admin))
      return await next();
    const list = permissions.map((u) => u.permission);
    if (!needPermissions.some((u) => list.some((p) => checkPermission(p, u)))) {
      throw new AuthError(
        i18n.t("permission.invalid", {
          permissions:
            "[" +
            needPermissions
              .filter((u) => !list.some((p) => checkPermission(p, u)))
              .join(", ") +
            "]",
        }),
      );
    }
    await next();
  };
}
