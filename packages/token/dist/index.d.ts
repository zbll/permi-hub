/**
 * JWT令牌生成和验证模块
 *
 * 该模块提供了创建和验证JWT令牌的功能，使用HMAC SHA-512算法进行签名和验证。
 * 依赖@zaubrik/djwt库实现JWT的核心功能，使用@packages/hooks的usePatience来统一错误处理。
 */
import { type Payload } from "@zaubrik/djwt";
/**
 * 创建JWT令牌
 *
 * @template T - 要存储在令牌中的数据类型
 * @param {T} data - 要存储在令牌中的数据
 * @param {number} [lifeTime=7 * 24 * 60 * 60] - 令牌的有效期（秒），默认为7天
 * @returns {Promise<string>} - 生成的JWT令牌字符串
 *
 * @example
 * const token = await createToken({ userId: "123", role: "admin" });
 */
export declare function createToken<T = unknown>(data: T, lifeTime?: number): Promise<string>;
/**
 * 验证JWT令牌
 *
 * @template T - 令牌中存储的数据类型，必须扩展自Payload接口
 * @param {string} token - 要验证的JWT令牌字符串
 * @returns {Promise<T>} - 验证结果，包含成功状态、数据和错误信息
 *
 * @example
 * try {
 *   const res = await verifyToken<{ userId: string, role: string }>(token);
 *   console.log('令牌验证成功，用户ID:', res.userId);
 * } catch (error) {
 *   console.error('令牌验证失败:', error);
 * }
 */
export declare function verifyToken<T extends Payload>(token: string): Promise<T>;
