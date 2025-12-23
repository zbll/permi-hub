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
function usePatience(value) {
    return new Promise((resolve) => {
        value
            .then((val) => resolve([true, val, null]))
            .catch((err) => resolve([false, null, err]));
    });
}

/**
 * 正则表达式常量对象
 *
 * 包含各种常用的验证正则表达式
 */
const Regexs = Object.freeze({
    /** HTTP URL验证正则表达式 */
    http: /^http:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/,
    /** HTTPS URL验证正则表达式 */
    https: /^https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/,
    /** 中文字符验证正则表达式 */
    chinese: /^[\u4e00-\u9fa5]+$/,
    /** 电子邮箱验证正则表达式 */
    email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    /** 通用互联网URL验证正则表达式 */
    internetUrl: /^[a-zA-Z]+:\/\/[^\s]+$/,
});
/**
 * 验证工具Hook函数
 *
 * 提供各种类型验证和数据格式验证功能的React Hook
 *
 * @returns 包含各种验证方法的对象
 */
function useValidate() {
    /**
     * 获取值的具体类型字符串表示
     *
     * @param {unknown} value - 要检查类型的值
     * @returns {string} 值的类型字符串，如"[object Object]"
     */
    const getInstance = (value) => Object.prototype.toString.call(value);
    /**
     * 验证值是否为普通对象
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是普通对象则返回true
     */
    const isObject = (value) => getInstance(value) === "[object Object]";
    /**
     * 验证值是否为数组
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是数组则返回true
     */
    const isArray = (value) => Array.isArray(value);
    /**
     * 验证值是否为字符串
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是字符串则返回true
     */
    const isString = (value) => typeof value === "string";
    /**
     * 验证值是否为数字
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是数字则返回true
     */
    const isNumber = (value) => typeof value === "number";
    /**
     * 验证值是否为布尔值
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是布尔值则返回true
     */
    const isBoolean = (value) => typeof value === "boolean";
    /**
     * 验证值是否为Date对象
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是Date对象则返回true
     */
    const isDate = (value) => getInstance(value) === "[object Date]";
    /**
     * 验证值是否为有效的JSON格式
     *
     * @param {unknown} value - 要验证的值
     * @returns {boolean} 如果是有效的JSON则返回true
     */
    const isJson = (value) => {
        if (isObject(value) || isArray(value) || isDate(value))
            return true;
        if (!isString(value))
            return false;
        try {
            JSON.parse(value);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (_) {
            return false;
        }
    };
    /**
     * 验证字符串是否为有效的URL
     *
     * @param {string} value - 要验证的字符串
     * @param {Object} [range] - URL协议范围限制
     * @param {boolean} [range.http] - 是否允许HTTP协议
     * @param {boolean} [range.https] - 是否允许HTTPS协议
     * @returns {boolean} 如果是有效的URL则返回true
     */
    const isUrl = (value, range) => {
        if (!range && (Regexs.http.test(value) || Regexs.https.test(value)))
            return true;
        if (range?.http && Regexs.http.test(value))
            return true;
        if (range?.https && Regexs.https.test(value))
            return true;
        return false;
    };
    /**
     * 验证字符串是否只包含中文字符
     *
     * @param {string} value - 要验证的字符串
     * @returns {boolean} 如果只包含中文字符则返回true
     */
    const isChinese = (value) => Regexs.chinese.test(value);
    /**
     * 验证字符串是否为有效的电子邮箱格式
     *
     * @param {string} value - 要验证的字符串
     * @returns {boolean} 如果是有效的电子邮箱则返回true
     */
    const isEmail = (value) => Regexs.email.test(value);
    /**
     * 验证字符串是否为有效的通用互联网URL
     *
     * @param {string} value - 要验证的字符串
     * @returns {boolean} 如果是有效的互联网URL则返回true
     */
    const isInternetUrl = (value) => Regexs.internetUrl.test(value);
    /**
     * 验证字符串是否为有效的日期格式
     *
     * @param {string} dateString - 要验证的日期字符串
     * @returns {boolean} 如果是有效的日期则返回true
     */
    const isValidDate = (dateString) => {
        return !isNaN(Date.parse(dateString));
    };
    return {
        getInstance,
        isObject,
        isArray,
        isString,
        isNumber,
        isBoolean,
        isDate,
        isJson,
        isUrl,
        isChinese,
        isEmail,
        isInternetUrl,
        isValidDate,
        Regexs,
    };
}

export { usePatience, useValidate };
