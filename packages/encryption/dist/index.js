// deno:https://jsr.io/@razr/crypto/0.0.1/cipher.ts
async function encrypt(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, key, data);
  return {
    encryptedData: new Uint8Array(encryptedData),
    iv
  };
}
async function decrypt(encryptedData, key, iv) {
  const decryptedData = await crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, key, encryptedData);
  return new Uint8Array(decryptedData);
}

// deno:https://jsr.io/@razr/crypto/0.0.1/utils.ts
function generateSalt(length = 16) {
  if (length < 16) {
    throw new Error("Salt length must be at least 16 bytes for security.");
  }
  return crypto.getRandomValues(new Uint8Array(length));
}
async function deriveKey(secret, salt, iterations = 1e5) {
  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode(secret);
  const keyMaterial = await crypto.subtle.importKey("raw", secretBuffer, {
    name: "PBKDF2"
  }, false, [
    "deriveKey"
  ]);
  return crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations,
    hash: "SHA-256"
  }, keyMaterial, {
    name: "AES-GCM",
    length: 256
  }, false, [
    "encrypt",
    "decrypt"
  ]);
}

// src/index.ts
var EncryptionSecret = crypto.randomUUID();
var EncryptionSalt = generateSalt();
var EncryptionKey = await deriveKey(EncryptionSecret, EncryptionSalt);
function toString(data) {
  return Array.from(data).map((u) => u.toString()).join(".");
}
function fromString(data) {
  return Uint8Array.from(data.split("."), (u) => Number(u));
}
async function encryption(text) {
  const data = new TextEncoder().encode(text);
  const { encryptedData, iv } = await encrypt(data, EncryptionKey);
  return `${toString(encryptedData)}-${toString(iv)}`;
}
async function decryption(text) {
  const [codeText, ivText] = text.split("-");
  if (!codeText || !ivText) throw new Error("\u53C2\u6570\u9519\u8BEF");
  const code = fromString(codeText);
  const iv = fromString(ivText);
  const decryptedData = await decrypt(code, EncryptionKey, iv);
  return new TextDecoder().decode(decryptedData);
}
function encryptionObject(data) {
  return encryption(JSON.stringify(data));
}
async function decryptionObject(text) {
  const json = await decryption(text);
  return JSON.parse(json);
}
export {
  decryption,
  decryptionObject,
  encryption,
  encryptionObject
};
