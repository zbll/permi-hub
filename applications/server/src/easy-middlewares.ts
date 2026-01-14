import { auth } from "@packages/middlewares";
import {
  AuthError,
  PermissionError,
  type ConnectInfoVar,
} from "@packages/types";
import { env } from "~env";
import { UserService } from "~services/user/UserService.ts";
import type { User } from "~entity/User.ts";
import type { Context, Next } from "hono";
import { cache } from "hono/cache";
import { usePatience, usePermission, usePermissionJson } from "@packages/hooks";
import { verifyToken } from "@packages/token";
import { i18n } from "~locale";
import type { MiddlewareHandler } from "hono";
import { getConnInfo } from "hono/deno";
import type { PermissionJson, Permissions } from "@packages/types";
import { permissionJson } from "./utils/permission-json.ts";

export type ConnInfo = ReturnType<typeof getConnInfo>;

export function connectInfo(): MiddlewareHandler<{
  Variables: ConnectInfoVar<ConnInfo>;
}> {
  return async (
    ctx: Context<{ Variables: ConnectInfoVar<ConnInfo> }>,
    next: Next,
  ) => {
    const info = getConnInfo(ctx);
    ctx.set("connectInfo", info);
    await next();
  };
}

export type AuthVar = {
  user: User;
};

export function useAuth() {
  return auth({
    prefix: env.AUTH_PREFIX,
    headerName: env.AUTH_HEADER_NAME,
    verifyToken: async (
      token,
      ctx: Context<{ Variables: AuthVar & ConnectInfoVar<ConnInfo> }>,
    ) => {
      const [isValid] = await usePatience(verifyToken(token));
      if (!isValid) throw new AuthError(i18n.t("token.invalid"));
      const [success, user] = await usePatience(UserService.fromToken(token));
      if (!success) throw new AuthError(i18n.t("token.invalid"));
      const currentIP = ctx.var.connectInfo?.remote.address;
      const isChangeIP = UserService.isChangeIp(user, currentIP);
      if (isChangeIP) throw new AuthError(i18n.t("token.ip.exception"));
      ctx.set("user", user);
      return true;
    },
  });
}

export function useCache(sec: number = 24 * 60 * 60) {
  return cache({
    cacheName: "global-cache-1",
    cacheControl: `max-age=${sec}, no-cache`,
    wait: true,
  });
}

/**
 * 检查用户是否有足够的权限
 * @param needPermissions 需要的权限列表
 * @returns 中间件处理函数
 */
export function useCheckPermission(
  needPermissions: string[],
): MiddlewareHandler {
  const { checkPermissions, fetchPermissionsMissingByUser } = usePermission();
  return async (ctx: Context<{ Variables: AuthVar }>, next) => {
    const user = ctx.var.user;
    const { roles } = user;
    const list = roles.map((u) => u.permissions);
    const permissions = list.flatMap((u) => u.map((u) => u.permission));
    if (!checkPermissions(needPermissions, permissions)) {
      throw new PermissionError(
        i18n.t("permission.invalid", {
          permissions:
            "[" +
            fetchPermissionsMissingByUser(needPermissions, permissions) +
            "]",
        }),
      );
    }
    await next();
  };
}

export type PermissionVar = {
  permission: {
    optional: Record<string, boolean>;
  };
};

export function useCheckPermissionById<T extends typeof permissionJson>(
  id: keyof T,
): MiddlewareHandler {
  const { checkPermissionById, getNeedPermission } = usePermissionJson(
    permissionJson as unknown as PermissionJson,
  );
  const { fetchPermissionsMissingByUser } = usePermission();
  return async (ctx: Context<{ Variables: AuthVar & PermissionVar }>, next) => {
    const user = ctx.var.user;
    const { roles } = user;
    const list = roles.map((u) => u.permissions);
    const permissions = list.flatMap((u) =>
      u.map((u) => u.permission as Permissions),
    );
    const checked = checkPermissionById(id as string, permissions);
    if (!checked.required) {
      const needPermissions = getNeedPermission(id as string);
      throw new PermissionError(
        i18n.t("permission.invalid", {
          permissions:
            "[" +
            fetchPermissionsMissingByUser(
              needPermissions.required,
              permissions,
            ) +
            "]",
        }),
      );
    }
    ctx.set("permission", checked);
    await next();
  };
}
