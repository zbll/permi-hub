import { Hono } from "hono";
import { validator } from "hono/validator";
import { LogService } from "~services/log/LogService.ts";
import { ServiceUtils } from "~services/ServiceUtils.ts";
import { useAuth, useCache, useCheckPermission } from "~/easy-middlewares.ts";
import { Permissions, RequestError } from "@packages/types";
import { useRequestValidator } from "@packages/hooks";
import { i18n, validatorOptions } from "~locale";

const router = new Hono();

router.get(
  "/list",
  useAuth(),
  useCheckPermission([Permissions.LoggerGet]),
  async (ctx) => {
    const sort_createAt = ctx.req.query("sort_createAt");
    const createAtSort = ServiceUtils.getSortParam(sort_createAt);
    const [success, list, error] = await LogService.list(createAtSort);
    if (!success) throw error;
    return ctx.json(list);
  },
);

router.get(
  "/page",
  useAuth(),
  useCheckPermission([Permissions.LoggerGet]),
  validator("query", (value) => {
    const { required, optional, fromSort } = useRequestValidator(
      value,
      validatorOptions,
    );
    const current = required("cur").type("string").toNumber();
    const size = optional("size").type("string").toNumberWithDefault(10);
    const createAtSort = fromSort("time", "DESC");
    return {
      current,
      size,
      createAtSort,
    };
  }),
  async (ctx) => {
    const { current, size, createAtSort } = ctx.req.valid("query");
    const [success, data, error] = await LogService.page(
      current,
      size,
      createAtSort,
    );
    if (!success) throw error;
    const [logs, total] = data;
    return ctx.json({
      list: logs,
      count: total,
    });
  },
);

router.get(
  "/:id",
  useAuth(),
  useCache(),
  useCheckPermission([Permissions.LoggerGet]),
  async (ctx) => {
    const id = ctx.req.param("id");
    if (!id) throw new RequestError(i18n.t("log.view.field.id.empty"));
    const [success, log] = await LogService.get(id);
    if (!success) throw new RequestError(i18n.t("log.view.error.not.exists"));
    return ctx.json(log);
  },
);

export default router;
