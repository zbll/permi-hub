import { Hono } from "hono";
import { LogService } from "../../services/log/LogService.ts";
import { ServiceUtils } from "../../services/ServiceUtils.ts";
import { useAuth, usePermission } from "../../easy-middlewares.ts";
import { Permissions } from "~permission";

const router = new Hono();

router.get(
  "/list",
  useAuth(),
  usePermission([Permissions.LoggerGet]),
  async (ctx) => {
    const sort_createAt = ctx.req.query("sort_createAt");
    const createAtSort = ServiceUtils.getSortParam(sort_createAt);
    const [success, list, error] = await LogService.list(createAtSort);
    if (!success) throw error;
    return ctx.json(list);
  },
);

router.get(
  "/:id",
  useAuth(),
  usePermission([Permissions.LoggerGet]),
  async (ctx) => {
    const id = ctx.req.param("id");
    if (!id) throw new Error("没有日志ID");
    const [success, log] = await LogService.get(id);
    return ctx.json(success ? log : null);
  },
);

export default router;
