import type { Context, MiddlewareHandler, Next } from "hono";
import { Result, type ResultLike } from "@packages/types";
import type { DataWrapperVar } from "./data-wrapper.ts";
import type { ErrorHandleVar } from "./error-handle.ts";

export interface Logger {
  onSuccess?: (ctx: Context, data: unknown) => void;
  onCatch?: (ctx: Context, data: unknown) => void;
}

export type LoggerOptions = {
  ignore?: (string | RegExp)[];
};

export function logger(
  log: Logger,
  options?: LoggerOptions,
): MiddlewareHandler {
  return async (
    ctx: Context<{ Variables: DataWrapperVar & ErrorHandleVar }>,
    next: Next,
  ) => {
    await next();
    const url = new URL(ctx.req.url).pathname;
    if (options?.ignore) {
      for (const item of options.ignore) {
        if (typeof item === "string" ? url.includes(item) : item.test(url)) {
          return;
        }
      }
    }
    const data = ctx.var.dataResult;
    if (!data || typeof data !== "object") return;
    const result = Result.fromLikeResult(data as ResultLike);
    result.stack = ctx.var.stack;
    switch (ctx.res.status) {
      case 200:
        log.onSuccess?.(ctx, result.toJsonString(false));
        break;
      default:
        log.onCatch?.(ctx, result.toJsonString(false));
        break;
    }
  };
}
