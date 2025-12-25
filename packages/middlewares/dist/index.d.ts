import { ResultCode } from '@packages/types';
import { Response } from '@oak/oak/response';
import { Hono } from 'hono';
import { Context } from '@oak/oak/context';
import { Next } from '@oak/oak/middleware';

/**
 * 响应结果类，用于统一 API 响应格式
 * @template T 数据类型
 */
declare class Result<T = unknown> extends Error {
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
    toReason(): string;
    /**
     * 判断一个值是否为 Result 实例
     */
    static isResult(value: unknown): value is Result;
    static from<T = unknown>(data: {
        code: ResultCode;
        message: string;
        data: T | null;
    }): Result<T>;
    static fromError<T = unknown>(err: Error): Result<T>;
}
/**
 * 成功结果类，用于表示成功的 API 响应
 * @template T 数据类型
 */
declare class OkResult<T = undefined> extends Result<T> {
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
declare function paramErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建服务器错误结果
 * @param message 错误消息
 */
declare function serverErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建认证错误结果
 * @param message 错误消息
 */
declare function authErrorResult(message: string): {
    code: ResultCode;
    message: string;
    data: unknown;
};
/**
 * 创建成功结果
 * @param data 响应数据
 */
declare function okResult<T = unknown>(data: T): {
    code: ResultCode;
    message: string;
    data: T | null;
};

/**
 * 自动注册控制器的配置选项
 */
type AutoRegisterOptions = {
    /**
     * 控制器目录路径（相对于项目根目录）
     * 默认值："/src/controllers"
     */
    controllerDir?: string;
    routerUse?: (router: unknown) => void;
};
/**
 * 自动注册控制器函数
 *
 * 该函数会自动扫描指定目录下的所有控制器文件夹，并自动注册路由
 * 每个控制器文件夹应该包含一个 index.ts 文件，该文件默认导出一个 Router 实例
 *
 * @param app - Oak 应用实例
 * @param options - 自动注册配置选项
 * @throws {Error} 当路由模块没有默认导出或默认导出不是 Router 实例时抛出错误
 *
 * @example
 * ```typescript
 * import { Hono } from "hono";
 * import { autoRegisterController } from "./auto-register-controller";
 *
 * const app = new Hono();
 * await autoRegisterController(app, { controllerDir: "/src/api" });
 * ```
 */
declare function autoRegisterController(app: Hono, options?: AutoRegisterOptions): Promise<void>;

interface DataWrapperLogger {
    onCatch?: (e: unknown, ctx: Context) => Promise<void>;
    onSuccess?: (e: unknown, ctx: Context) => Promise<void>;
}
type DataWrapperOptions = {
    ignore?: (string | RegExp)[];
};
/**
 * 数据包装器中间件
 * 这是一个高阶函数，用于统一处理HTTP响应数据的格式和错误处理
 *
 * 主要功能：
 * 1. 统一响应格式：将响应数据包装成标准格式
 * 2. 错误处理：捕获并统一处理异常
 * 3. 日志记录：支持成功和错误的日志回调
 * 4. 路径过滤：支持配置忽略某些路径的日志记录
 *
 * @param logger 可选的日志记录器，用于记录成功和错误信息
 * @param options 可选的配置选项，用于配置忽略路径等
 * @returns Oak中间件函数
 */
declare const dataWrapper: (logger?: DataWrapperLogger, options?: DataWrapperOptions) => (ctx: Context, next: Next) => Promise<void>;

export { OkResult, Result, authErrorResult, autoRegisterController, dataWrapper, okResult, paramErrorResult, serverErrorResult };
export type { AutoRegisterOptions, DataWrapperLogger, DataWrapperOptions };
