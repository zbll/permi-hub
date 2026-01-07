import { Hono } from "hono";
import { validator } from "hono/validator";
import { LogService } from "~services/log/LogService.ts";
import { ServiceUtils } from "~services/ServiceUtils.ts";
import { useAuth, useCache, useCheckPermission } from "~/easy-middlewares.ts";
import {
  Permissions,
  RequestError,
  type LogPageIsSuccessFilter,
  type LogPageRequestTypeFilter,
} from "@packages/types";
import { useRequestValidator } from "@packages/hooks";
import { i18n, validatorOptions } from "~locale";
import { Logger } from "~logger";

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
    const filter = optional("filter").type("string").toStringWithDefault("");
    const isSuccessFilter = optional("success")
      .type("string")
      .toStringWithDefault("all") as LogPageIsSuccessFilter;
    const requestTypeFilter = optional("method")
      .type("string")
      .toStringWithDefault("all") as LogPageRequestTypeFilter;
    return {
      current,
      size,
      createAtSort,
      filter,
      isSuccessFilter,
      requestTypeFilter,
    };
  }),
  async (ctx) => {
    const {
      current,
      size,
      createAtSort,
      filter,
      isSuccessFilter,
      requestTypeFilter,
    } = ctx.req.valid("query");
    const [success, data, error] = await LogService.page(
      current,
      size,
      filter,
      createAtSort,
      isSuccessFilter,
      requestTypeFilter,
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

router.get(
  "/locale/logger/list",
  useAuth(),
  useCheckPermission([Permissions.LocaleLogger]),
  validator("query", (value) => {
    const { optional } = useRequestValidator(value, validatorOptions);
    const current = optional("cur").type("string").toNumberWithDefault(1);
    const size = optional("size").type("string").toNumberWithDefault(20);
    return {
      current,
      size,
    };
  }),
  async (ctx) => {
    const { current, size } = ctx.req.valid("query");
    const skip = (current - 1) * size;

    // First get total count
    const countQuery = new Promise((resolve, reject) => {
      Logger.query(
        {
          fields: ["level", "message", "timestamp"],
          order: "desc",
          limit: -1,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    // Then get paginated data
    const dataQuery = new Promise((resolve, reject) => {
      Logger.query(
        {
          fields: ["level", "message", "timestamp"],
          order: "desc",
          start: skip,
          limit: size,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    // deno-lint-ignore no-explicit-any
    const [countResult, dataResult]: [any, any] = await Promise.all([
      countQuery,
      dataQuery,
    ]);

    const total = countResult?.dailyRotateFile?.length || 0;
    const list = dataResult?.dailyRotateFile || [];

    return ctx.json({
      list,
      count: total,
    });
  },
);

export default router;
