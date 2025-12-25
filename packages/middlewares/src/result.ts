import { ResultCode } from "@packages/types";
import { type Context } from "hono";

export type StatusCode = Parameters<Context["status"]>[0];

export type ResultLike = {
  code: unknown;
  message: string;
  data: unknown;
};

/**
 * 响应结果类，用于统一 API 响应格式
 * @template T 数据类型
 */
export class Result<T = unknown> extends Error {
  constructor(code: ResultCode, message: string, data: T | null) {
    super(message);
    this.name = code;
    this.code = code;
    this.data = data;
  }

  /**
   * 响应数据
   */
  public data: T | null = null;

  /**
   * 将结果转换为 JSON 字符串
   */
  override toString() {
    return JSON.stringify(this);
  }

  /**
   * 结果代码
   */
  private _code: ResultCode = ResultCode.Ok;
  /**
   * HTTP 状态码
   */
  private _statusCode: StatusCode = 200;
  /**
   * 获取结果代码
   */
  public get code() {
    return this._code;
  }
  /**
   * 设置结果代码，并自动更新 HTTP 状态码
   */
  public set code(value: ResultCode) {
    this._code = value;
    switch (this.code) {
      case ResultCode.Ok:
        this._statusCode = 200;
        break;
      case ResultCode.RequestError:
        this._statusCode = 400;
        break;
      case ResultCode.AuthError:
        this._statusCode = 401;
        break;
      case ResultCode.PermissionError:
        this._statusCode = 403;
        break;
      default:
        this._statusCode = 500;
        break;
    }
  }

  /**
   * 获取 HTTP 状态码
   */
  public get statusCode() {
    return this._statusCode;
  }

  /**
   * 转换为响应体格式
   */
  public toJson(safe = true) {
    const json = {
      code: this.code,
      message: this.message,
      data: this.data,
      stack: this.stack,
    };
    if (safe) delete json.stack;
    return json;
  }

  /**
   * 将结果转换为 JSON 字符串
   */
  public toJsonString(safe = true) {
    return JSON.stringify(this.toJson(safe));
  }

  /**
   * 生成详细的错误原因字符串
   *
   * 该方法将结果对象的详细信息格式化为可读的字符串，包含：
   * - 错误代码 (Code)
   * - HTTP 状态码 (StatusCode)
   * - 错误消息 (Message)
   * - 响应数据 (Data)
   * - 调用堆栈 (Stack)
   *
   * 主要用于调试和日志记录，便于开发人员快速定位问题
   *
   * @returns {string} 格式化的错误原因字符串
   *
   * @example
   * ```typescript
   * const result = new Result();
   * result.code = ResultCode.ServerError;
   * result.message = "数据库连接失败";
   * result.data = { host: "localhost", port: 3306 };
   *
   * console.log(result.toReason());
   * // 输出:
   * // Code: server_error,
   * // StatusCode: 500,
   * // Message: 数据库连接失败,
   * // Data: {"host":"localhost","port":3306}
   * // Stack: Error: 数据库连接失败
   * //     at ...
   * ```
   */
  public toReason(): string {
    return `Code: ${this.code},
StatusCode: ${this.statusCode},
Message: ${this.message},
Data: ${JSON.stringify(this.data)}
Stack: ${this.stack}`;
  }

  /**
   * 判断一个值是否为 Result 实例
   */
  static isResult(value: unknown): value is Result {
    if (value && typeof value === "object") {
      return Boolean(
        (value as Record<string, unknown>).code &&
        (value as Record<string, unknown>).message &&
        "data" in value,
      );
    }
    return false;
  }

  static fromError(error: Error) {
    switch (error.name) {
      case ResultCode.RequestError:
      case ResultCode.AuthError:
      case ResultCode.PermissionError:
        return new Result(error.name, error.message, null);
      default:
        return new Result(ResultCode.ServerError, error.message, null);
    }
  }

  static fromLikeResult<T = unknown>(value: ResultLike) {
    return new Result(
      value.code as ResultCode,
      value.message,
      value.data as T | null,
    );
  }
}

export class OkResult<T = undefined> extends Result<T> {
  constructor(data: T) {
    super(ResultCode.Ok, ResultCode.Ok, data);
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ResultCode.ServerError;
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ResultCode.AuthError;
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ResultCode.PermissionError;
  }
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ResultCode.RequestError;
  }
}
