import type { Context, MiddlewareHandler, Next } from "hono";
import type { ConnectInfoVar } from "./connect-info.ts";
import { OkResult, Result } from "./result.ts";
import { ResultCode } from "@packages/types";

export type DataWrapperVar = {
  dataResult?: unknown;
};

/**
 * 数据包装器中间件
 * 用于统一处理HTTP响应的格式，将不同状态码的响应包装成标准格式
 *
 * 主要功能：
 * 1. 根据HTTP状态码选择不同的处理函数
 * 2. 将响应数据包装成统一的JSON格式
 * 3. 支持成功(200)、错误(500)和未授权(401)状态的处理
 *
 * @returns Hono中间件处理器
 */
export function dataWrapper(): MiddlewareHandler<{
  Variables: ConnectInfoVar;
}> {
  return async (
    ctx: Context<{ Variables: ConnectInfoVar & DataWrapperVar }>,
    next: Next,
  ) => {
    // 执行下一个中间件或路由处理函数
    await next();
    const status = ctx.res.status;
    let response: Response | null = null;
    switch (status) {
      case 200: {
        const json = await ctx.res.json();
        const data = handleSuccess(json, ctx.res.headers);
        ctx.set("dataResult", data.result);
        response = data.response;
        break;
      }
      case 400:
      case 401:
      case 403:
      case 500: {
        const json = await ctx.res.json();
        const error = handleError(json, status, ctx.res.headers);
        ctx.set("dataResult", error.result);
        response = error.response;
        break;
      }
      default: {
        const json = await ctx.res.text();
        const other = handleOther(json, ctx.res.headers);
        ctx.set("dataResult", other.result);
        response = other.response;
        break;
      }
    }
    if (response) ctx.res = response;
  };
}

/**
 * 处理成功响应(状态码200)
 * 将原始响应数据包装成标准成功格式
 *
 * @param json 原始响应数据
 * @param headers 原始响应头
 * @returns 包装后的响应对象
 */
function handleSuccess(json: Record<string, unknown>, headers: Headers) {
  // 创建新的响应，使用标准成功格式
  const result = new OkResult(json).toJson();
  return {
    response: new Response(JSON.stringify(result), {
      headers,
      status: 200,
    }),
    result,
  };
}

/**
 * 处理服务器错误响应(状态码500)
 * 将错误信息包装成标准错误格式
 *
 * @param json 原始错误数据
 * @param headers 原始响应头
 * @returns 包装后的错误响应对象
 */
function handleError(
  json: Record<string, unknown>,
  status: number,
  headers: Headers,
) {
  // 创建新的响应，使用标准错误格式
  const result = json;
  return {
    response: new Response(JSON.stringify(json), {
      headers,
      status,
    }),
    result,
  };
}

function handleOther(data: string, headers: Headers) {
  // 创建新的响应，使用标准错误格式
  return {
    response: new Response(
      new Result(ResultCode.RequestError, data, null).toJsonString(),
      {
        headers,
        status: 400,
      },
    ),
    result: data,
  };
}
