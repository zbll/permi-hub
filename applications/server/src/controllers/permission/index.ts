import { Hono } from "hono";
import {
  useAuth,
  useCheckPermission,
  type AuthVar,
} from "../../easy-middlewares.ts";
import { Permissions, RequestError } from "@packages/types";
import { PermissionService } from "~services/permission/PermissionService.ts";
import { i18n } from "~locale";

const router = new Hono<{
  Variables: AuthVar;
}>();

router.get(
  "/list",
  useAuth(),
  useCheckPermission([Permissions.PermissionGet]),
  async (ctx) => {
    const [success, permissions] = await PermissionService.list();
    if (!success) throw new RequestError(i18n.t("permission.get.error"));
    return ctx.json(permissions);
  },
);

export default router;
