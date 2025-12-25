// 导入 MD5 哈希算法库
import { Md5 } from "ts-md5";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "top secret",
  },
});

export { publicKey, privateKey };

export function encryption(text: string) {
  const oText = Buffer.from(text);
  return crypto.publicEncrypt(publicKey, oText).toBase64();
}

export function decryption(text: string) {
  const iText = Buffer.from(text, "base64");
  return crypto.privateDecrypt(privateKey, iText).toString();
}

/**
 * MD5 哈希函数
 * 对文本进行 MD5 哈希计算，生成固定长度的哈希值
 *
 * @param text - 需要哈希的文本
 * @returns 32位十六进制格式的 MD5 哈希值
 *
 * @example
 * ```typescript
 * const hash = md5("Hello World");
 * console.log(hash); // 输出类似 "b10a8db164e0754105b7a99be72e3fe5"
 * ```
 */
export function md5(text: string): string {
  return Md5.hashStr(text);
}
