/**
 * 验证工具Hook函数
 *
 * 提供各种类型验证和数据格式验证功能的React Hook
 *
 * @returns 包含各种验证方法的对象
 */
export declare function useValidate(): {
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
