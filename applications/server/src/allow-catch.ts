import { type Logger } from "@packages/middlewares";
import type { Context } from "hono";
import { LogService } from "./services/log/LogService.ts";

// 允许捕获所有类型的异常，记录到数据库
export class AllowCatch implements Logger {
  async onCatch(ctx: Context, data: unknown) {
    const log = await LogService.fromError(ctx, data);
    LogService.add(log);
  }

  async onSuccess(ctx: Context, data: unknown) {
    const log = await LogService.fromSuccess(ctx, data);
    LogService.add(log);
  }
}
