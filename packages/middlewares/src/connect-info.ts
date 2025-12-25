import type { Context, MiddlewareHandler, Next } from "hono";
import { getConnInfo } from "hono/deno";

export type ConnectInfoVar = { connectInfo?: ReturnType<typeof getConnInfo> };

export function connectInfo(): MiddlewareHandler<{
  Variables: ConnectInfoVar;
}> {
  return async (ctx: Context<{ Variables: ConnectInfoVar }>, next: Next) => {
    const info = getConnInfo(ctx);
    ctx.set("connectInfo", info);
    await next();
  };
}
