import type { Context, ErrorHandler } from "hono";
import { Result } from "./result.ts";

export type ErrorHandleVar = {
  stack?: string;
};

export function errorHandle(): ErrorHandler {
  return (err, ctx: Context<{ Variables: ErrorHandleVar }>) => {
    const result = Result.fromError(err);
    ctx.set("stack", err.stack);

    // 返回 JSON 格式的错误响应
    return new Response(result.toJsonString(), {
      status: result.statusCode,
      headers: ctx.res.headers,
    });
  };
}
