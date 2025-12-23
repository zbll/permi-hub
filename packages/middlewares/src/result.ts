import { ResultCode } from "@packages/types";
import { Response } from "@oak/oak/response";

/**
 * 响应结果类，用于统一 API 响应格式
 * @template T 数据类型
 */
export class Result<T = unknown> extends Error {
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
  private _statusCode = 200;
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
    this._statusCode = this.getStatusCode();
  }

  /**
   * 获取 HTTP 状态码
   */
  public get statusCode() {
    return this._statusCode;
  }

  /**
   * 设置响应消息
   */
  public setMessage(message: string) {
    this.message = message;
    return this;
  }

  /**
   * 设置结果代码
   */
  public setCode(code: ResultCode) {
    this.code = code;
    return this;
  }

  /**
   * 根据结果代码获取对应的 HTTP 状态码
   */
  private getStatusCode() {
    switch (this.code) {
      case ResultCode.Ok:
        return 200;
      case ResultCode.ParamError:
        return 400;
      case ResultCode.AuthError:
        return 401;
      default:
        return 500;
    }
  }

  /**
   * 转换为响应体格式
   */
  public toBody() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }

  /**
   * 渲染响应
   */
  public render(response: Response) {
    response.status = this.statusCode;
    response.body = JSON.stringify(this.toBody());
    return this.toBody();
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
}

/**
 * 成功结果类，用于表示成功的 API 响应
 * @template T 数据类型
 */
export class OkResult<T = undefined> extends Result<T> {
  /**
   * 创建成功结果
   * @param data 响应数据
   */
  constructor(data: T) {
    super();
    this.code = ResultCode.Ok;
    this.data = data;
  }
}

/**
 * 基础错误结果实例
 */
const baseError = new Result();

/**
 * 创建参数错误结果
 * @param message 错误消息
 */
export function paramErrorResult(message: string) {
  return baseError.setMessage(message).setCode(ResultCode.ParamError).toBody();
}

/**
 * 创建服务器错误结果
 * @param message 错误消息
 */
export function serverErrorResult(message: string) {
  return baseError.setMessage(message).setCode(ResultCode.ServerError).toBody();
}

/**
 * 创建认证错误结果
 * @param message 错误消息
 */
export function authErrorResult(message: string) {
  return baseError.setMessage(message).setCode(ResultCode.AuthError).toBody();
}

/**
 * 创建成功结果
 * @param data 响应数据
 */
export function okResult<T = unknown>(data: T) {
  return new OkResult<T>(data).toBody();
}
