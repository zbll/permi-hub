import type { Context, MiddlewareHandler, Next } from "hono";

export function verifyValueFromKey(options?: {
  ignore?: (string | RegExp)[];
}): MiddlewareHandler {
  return async (ctx: Context, next: Next) => {
    const { ignore = [] } = options || {};
    const { path } = ctx.req;
    if (
      ignore.some((item) =>
        typeof item === "string" ? path.includes(item) : item.test(path),
      )
    ) {
      await next();
      return;
    }
    await next();
  };
}
