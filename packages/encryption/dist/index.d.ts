/**
 * 加密字符串
 *
 * @param {string} text - 要加密的明文字符串
 * @returns {Promise<string>} - 加密后的字符串，格式为"密文-iv"
 *
 * @example
 * const encrypted = await encryption("敏感信息");
 * // 返回类似 "123.456.789-10.11.12" 的加密字符串
 */
export declare function encryption(text: string): Promise<string>;
/**
 * 解密字符串
 *
 * @param {string} text - 要解密的字符串，格式为"密文-iv"
 * @returns {Promise<string>} - 解密后的明文字符串
 * @throws {Error} - 当输入格式错误时抛出异常
 *
 * @example
 * const decrypted = await decryption("123.456.789-10.11.12");
 * // 返回解密后的明文 "敏感信息"
 */
export declare function decryption(text: string): Promise<string>;
/**
 * 加密对象
 *
 * @template T - 要加密的对象类型
 * @param {T} data - 要加密的对象
 * @returns {Promise<string>} - 加密后的字符串
 *
 * @example
 * const user = { id: "123", name: "张三" };
 * const encrypted = await encryptionObject(user);
 */
export declare function encryptionObject<T>(data: T): Promise<string>;
/**
 * 解密对象
 *
 * @template T - 解密后要转换的对象类型
 * @param {string} text - 要解密的字符串
 * @returns {Promise<T>} - 解密后的对象
 * @throws {Error} - 当输入格式错误或JSON解析失败时抛出异常
 *
 * @example
 * const encrypted = "123.456.789-10.11.12";
 * const user = await decryptionObject<{ id: string, name: string }>(encrypted);
 */
export declare function decryptionObject<T>(text: string): Promise<T>;
