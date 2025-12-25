import type { Context, MiddlewareHandler, Next } from "hono";
import { Result, type ResultLike } from "./result.ts";
import type { DataWrapperVar } from "./data-wrapper.ts";
import type { ErrorHandleVar } from "./error-handle.ts";

export interface Logger {
  onSuccess?: (ctx: Context, data: unknown) => void;
  onCatch?: (ctx: Context, data: unknown) => void;
}

export function logger(log: Logger): MiddlewareHandler {
  return async (
    ctx: Context<{ Variables: DataWrapperVar & ErrorHandleVar }>,
    next: Next,
  ) => {
    await next();
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
