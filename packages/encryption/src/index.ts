/**
 * 加密解密工具模块
 *
 * 该模块提供了字符串和对象的加密解密功能，使用@razr/crypto库实现加密算法。
 * 支持AES加密，使用随机生成的密钥和盐进行安全加密。
 */
import { generateSalt, deriveKey, encrypt, decrypt } from "@razr/crypto";

/**
 * 加密密钥的原始字符串，使用随机UUID生成
 *
 * @type {string} - 用于派生加密密钥的原始字符串
 */
const EncryptionSecret: string = crypto.randomUUID();

/**
 * 加密盐值，用于增强密钥的安全性
 *
 * @type {Uint8Array<ArrayBufferLike>} - 由@razr/crypto库生成的盐值
 */
const EncryptionSalt: Uint8Array<ArrayBufferLike> = generateSalt();

/**
 * 实际用于加密和解密的密钥，通过密钥字符串和盐派生而来
 *
 * @type {CryptoKey} - 用于AES加密和解密的加密密钥
 */
const EncryptionKey: CryptoKey = await deriveKey(
  EncryptionSecret,
  EncryptionSalt,
);

/**
 * 将Uint8Array转换为字符串表示形式
 *
 * @param {Uint8Array} data - 要转换的二进制数据
 * @returns {string} - 转换后的字符串，使用点分隔的数字表示
 *
 * @example
 * const data = new Uint8Array([1, 2, 3]);
 * const str = toString(data); // "1.2.3"
 */
function toString(data: Uint8Array): string {
  return Array.from(data)
    .map((u) => u.toString())
    .join(".");
}

/**
 * 将字符串表示形式转换为Uint8Array
 *
 * @param {string} data - 要转换的字符串，使用点分隔的数字表示
 * @returns {Uint8Array} - 转换后的二进制数据
 *
 * @example
 * const str = "1.2.3";
 * const data = fromString(str); // Uint8Array [1, 2, 3]
 */
function fromString(data: string): Uint8Array {
  return Uint8Array.from(data.split("."), (u) => Number(u));
}

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
export async function encryption(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const { encryptedData, iv } = await encrypt(data, EncryptionKey);
  return `${toString(encryptedData)}-${toString(iv)}`;
}

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
export async function decryption(text: string): Promise<string> {
  const [codeText, ivText] = text.split("-");
  if (!codeText || !ivText) throw new Error("参数错误");
  const code = fromString(codeText);
  const iv = fromString(ivText);
  const decryptedData = await decrypt(code, EncryptionKey, iv);
  return new TextDecoder().decode(decryptedData);
}

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
export function encryptionObject<T>(data: T): Promise<string> {
  return encryption(JSON.stringify(data));
}

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
export async function decryptionObject<T>(text: string): Promise<T> {
  const json = await decryption(text);
  return JSON.parse(json) as T;
}
