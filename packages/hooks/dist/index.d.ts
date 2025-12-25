/**
 * 表示异步操作的结果类型
 * @template T - 成功时返回的数据类型
 * @type {[success: boolean, data: T | null, error: unknown | null]} - 三元组表示的异步结果
 *   - 当操作成功时: [true, data, null]
 *   - 当操作失败时: [false, null, error]
 */
type Patience<T = unknown> = [true, T, null] | [false, null, unknown];
/**
 * 将Promise包装成具有统一返回格式的异步结果
 * @template T - Promise成功时返回的数据类型
 * @param {Promise<T>} value - 要处理的Promise对象
 * @returns {Promise<Patience<T>>} - 包装后的Promise，始终解析为统一的三元组格式
 * @example
 * const [success, data, error] = await usePatience(fetchData());
 * if (success) {
 *   console.log('数据获取成功:', data);
 * } else {
 *   console.error('数据获取失败:', error);
 * }
 */
declare function usePatience<T = unknown>(value: Promise<T>): Promise<Patience<T>>;

/**
 * 验证工具Hook函数
 *
 * 提供各种类型验证和数据格式验证功能的React Hook
 *
 * @returns 包含各种验证方法的对象
 */
declare function useValidate(): {
    getInstance: (value: unknown) => string;
    isObject: (value: unknown) => value is object;
    isArray: (value: unknown) => value is Array<unknown>;
    isString: (value: unknown) => value is string;
    isNumber: (value: unknown) => value is number;
    isBoolean: (value: unknown) => value is boolean;
    isDate: (value: unknown) => value is Date;
    isJson: (value: unknown) => value is string;
    isUrl: (value: string, range?: {
        http?: boolean;
        https?: boolean;
    }) => boolean;
    isChinese: (value: string) => boolean;
    isEmail: (value: string) => boolean;
    isInternetUrl: (value: string) => boolean;
    isValidDate: (dateString: string) => boolean;
    Regexs: Readonly<{
        /** HTTP URL验证正则表达式 */
        http: RegExp;
        /** HTTPS URL验证正则表达式 */
        https: RegExp;
        /** 中文字符验证正则表达式 */
        chinese: RegExp;
        /** 电子邮箱验证正则表达式 */
        email: RegExp;
        /** 通用互联网URL验证正则表达式 */
        internetUrl: RegExp;
    }>;
};

export { usePatience, useValidate };
export type { Patience };
