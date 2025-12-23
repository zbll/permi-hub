import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";
import { Result, serverErrorResult } from "./result.ts";

export default async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (e: unknown) {
    if (Result.isResult(e)) {
      ctx.response.body = e;
      return;
    } else if (Result.isError(e)) {
      ctx.response.body = serverErrorResult(e.message);
      return;
    } else {
      ctx.response.body = serverErrorResult(String(e));
      return;
    }
  }
};
