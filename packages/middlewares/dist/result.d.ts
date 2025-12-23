import { ResultCode } from "@packages/types";
import { Response } from "@oak/oak/response";
/**
 * 响应结果类，用于统一 API 响应格式
 * @template T 数据类型
 */
export declare class Result<T = unknown> extends Error {
    /**
     * 响应数据
     */
    data: T | null;
    /**
     * 将结果转换为 JSON 字符串
     */
    toString(): string;
    /**
     * 结果代码
     */
    private _code;
    /**
     * HTTP 状态码
     */
    private _statusCode;
    /**
     * 获取结果代码
     */
    get code(): ResultCode;
    /**
     * 设置结果代码，并自动更新 HTTP 状态码
     */
    set code(value: ResultCode);
    /**
     * 获取 HTTP 状态码
     */
    get statusCode(): number;
    /**
     * 设置响应消息
     */
    setMessage(message: string): this;
    /**
     * 设置结果代码
     */
    setCode(code: ResultCode): this;
    /**
     * 根据结果代码获取对应的 HTTP 状态码
     */
    private getStatusCode;
    /**
     * 转换为响应体格式
     */
    toBody(): {
        code: ResultCode;
        message: string;
        data: T | null;
    };
    /**
     * 渲染响应
     */
    render(response: Response): {
        code: ResultCode;
        message: string;
        data: T | null;
    };
    /**
     * 判断一个值是否为 Result 实例
     */
    static isResult(value: unknown): value is Result;
}
/**
 * 成功结果类，用于表示成功的 API 响应
 * @template T 数据类型
 */
export declare class OkResult<T = undefined> extends Result<T> {
    /**
     * 创建成功结果
     * @param data 响应数据
     */
    constructor(data: T);
}
/**
 * 创建参数错误结果
 * @param message 错误消息
 */
export declare function paramErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建服务器错误结果
 * @param message 错误消息
 */
export declare function serverErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建认证错误结果
 * @param message 错误消息
 */
export declare function authErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建成功结果
 * @param data 响应数据
 */
export declare function okResult<T = unknown>(data: T): {
    code: ResultCode;
    message: string;
    data: T | null;
};
