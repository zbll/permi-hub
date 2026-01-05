import type { Context } from "hono";
import { Log } from "~entity/Log.ts";
import { AppDataSource } from "~data-source";
import { usePatience, type Patience } from "@packages/hooks";
import { Result, type ConnectInfoVar } from "@packages/types";
import { ResultCode } from "@packages/types";
import { Like, type FindOptionsOrderValue } from "typeorm";

export class LogService {
  private static async getParams(ctx: Context): Promise<string> {
    const method = ctx.req.method;
    switch (method) {
      case "GET":
      case "DELETE": {
        const params: Record<string, string> = {};
        const url = new URL(ctx.req.url);
        const searchParams = new URLSearchParams(url.search);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return JSON.stringify(params);
      }
      case "POST": {
        const headers = ctx.req.header();
        Object.keys(headers).forEach((key) => {
          headers[key.toLowerCase()] = headers[key];
        });
        const contentType = headers["content-type"];
        if (contentType === "application/json") {
          const body = await ctx.req.json();
          return JSON.stringify(body);
        } else if (
          contentType.includes("application/x-www-form-urlencoded") ||
          contentType.includes("multipart/form-data")
        ) {
          const body = await ctx.req.formData();
          return JSON.stringify(Object.fromEntries(body.entries()));
        } else {
          return await ctx.req.text();
        }
      }
      default:
        return await ctx.req.text();
    }
  }

  static async fromSuccess(
    ctx: Context<{ Variables: ConnectInfoVar }>,
    response: unknown,
  ) {
    const req = ctx.req;
    const log = new Log();
    log.id = crypto.randomUUID();
    log.url = req.url;
    log.method = req.method;
    log.params = await this.getParams(ctx);
    log.requestIp = ctx.var.connectInfo?.remote.address || "";
    log.isSecure = new URL(ctx.req.url).protocol === "https:";
    log.language = ctx.req.header("Accept-Language") || "";
    log.userAgent = ctx.req.header("User-Agent") || "";
    log.headers = ctx.req.header();
    log.response = String(response);
    log.isSuccess = true;
    log.reason = "";
    return log;
  }

  static async fromError(
    ctx: Context<{ Variables: ConnectInfoVar }>,
    response: unknown,
  ) {
    const log = new Log();
    log.id = crypto.randomUUID();
    log.url = ctx.req.url;
    log.method = ctx.req.method;
    log.params = await this.getParams(ctx);
    log.requestIp = ctx.var.connectInfo?.remote.address || "";
    log.isSecure = new URL(ctx.req.url).protocol === "https:";
    log.language = ctx.req.header("Accept-Language") || "";
    log.userAgent = ctx.req.header("User-Agent") || "";
    log.headers = ctx.req.header();
    log.isSuccess = false;
    const data = JSON.parse(String(response));
    if (Result.isResult(data)) {
      const result = Result.fromLikeResult(data);
      log.response = result.toJsonString(false);
      log.reason = result.toReason();
    } else {
      const result = new Result(ResultCode.ServerError, data, null);
      log.response = result.toJsonString(false);
      log.reason = String(data);
    }
    return log;
  }

  static async add(log: Log): Promise<Patience<Log>> {
    return await usePatience(AppDataSource.manager.save(log));
  }

  static async list(time?: FindOptionsOrderValue): Promise<Patience<Log[]>> {
    return await usePatience(
      AppDataSource.manager.find(Log, {
        order: {
          createAt: time,
        },
      }),
    );
  }

  static page(
    cur: number,
    size: number,
    filter: string,
    time?: FindOptionsOrderValue,
  ) {
    return usePatience(
      AppDataSource.manager.findAndCount(Log, {
        skip: (cur - 1) * size,
        take: size,
        where: {
          url: Like(`%${filter}%`),
        },
        order: {
          createAt: time,
        },
      }),
    );
  }

  static async get(id: string): Promise<Patience<Log>> {
    return await usePatience(
      AppDataSource.manager.findOneOrFail(Log, {
        where: {
          id,
        },
      }),
    );
  }
}
