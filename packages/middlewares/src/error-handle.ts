import type { Context, ErrorHandler } from "hono";
import { Result } from "@packages/types";
import { ResultCode } from "@packages/types";

export type ErrorHandleVar = {
  stack?: string;
};

export function errorHandle(noAuthMessage: () => string): ErrorHandler {
  return (err, ctx: Context<{ Variables: ErrorHandleVar }>) => {
    // deno-lint-ignore no-explicit-any
    const res: Response = (err as any)["res"];
    if (
      err.name === Error.name &&
      typeof res === "object" &&
      res.status === 401
    ) {
      return new Response(
        new Result(ResultCode.AuthError, noAuthMessage(), null).toJsonString(),
        {
          status: 401,
          headers: ctx.res.headers,
        },
      );
    }
    const result = Result.fromError(err);
    ctx.set("stack", err.stack);

    // 返回 JSON 格式的错误响应
    return new Response(result.toJsonString(), {
      status: result.statusCode,
      headers: ctx.res.headers,
    });
  };
}
