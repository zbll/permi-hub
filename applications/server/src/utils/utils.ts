import { redisClient } from "~redis";
import type { Context } from "hono";
import { setSignedCookie, getSignedCookie } from "hono/cookie";
import { privateKey } from "@packages/encryption";
import { env } from "~env";

/**
 * 设置用户令牌
 * 将用户ID与令牌关联存储在Redis中，支持设置过期时间
 * @param userId 用户ID
 * @param token 令牌
 * @param expiration 过期时间（秒），默认为1天
 */
export async function setUserToken(
  userId: string,
  token: string,
  expiration = 1 * 24 * 60 * 60,
) {
  // 检查该令牌是否已经与当前用户关联
  const existingUserId = await redisClient.get(token);
  if (existingUserId === userId) return;

  // 构建用户键名，用于存储用户的令牌列表
  const userIdKey = `user:${userId}`;

  // 获取当前用户已登录的令牌数量
  const currentCount = await redisClient.lLen(userIdKey);

  // 如果达到最大登录数量限制
  if (currentCount >= env.MAX_USER_LOGIN_COUNT) {
    // 超过最大登录数，删除最早的token
    const oldestToken = await redisClient.lPop(userIdKey);
    if (oldestToken) {
      await redisClient.unlink(oldestToken);
    }
  }

  // 将新令牌添加到用户令牌列表的末尾
  await redisClient.rPush(userIdKey, token);

  // 设置令牌与用户ID的映射关系，并设置过期时间
  await redisClient.set(token, userId, {
    expiration: {
      type: "EX",
      value: expiration,
    },
  });
  // 为令牌设置过期事件定时，触发时自动移除令牌
  setTimeout(() => {
    removeUserToken(userId, token);
  }, expiration * 1000);
}

/**
 * 移除用户令牌
 * 从Redis中删除指定用户和令牌的关联
 * @param userId 用户ID
 * @param token 令牌
 */
export async function removeUserToken(userId: string, token: string) {
  // 构建用户键名
  const userIdKey = `user:${userId}`;

  // 从用户令牌列表中移除指定令牌
  await redisClient.lRem(userIdKey, 0, token);

  // 删除令牌与用户ID的映射关系
  await redisClient.unlink(token);
}

/**
 * 检查用户令牌是否存在
 * @param userId 用户ID
 * @param token 令牌
 * @returns 是否存在
 */
export async function checkUserToken(userId: string, token: string) {
  // 构建用户键名
  const userIdKey = `user:${userId}`;

  // 检查令牌是否存在于用户令牌列表中
  const tokenIndex = await redisClient.lPos(userIdKey, token);
  if (tokenIndex === null) return false;

  // 返回令牌
  return true;
}

/**
 * 设置Cookie
 * @param ctx Hono上下文对象
 * @param key Cookie键名
 * @param value Cookie值
 */
export async function setCookie(ctx: Context, key: string, value: string) {
  await setSignedCookie(ctx, key, value, privateKey);
}

/**
 * 获取Cookie
 * @param ctx Hono上下文对象
 * @param key Cookie键名
 * @returns Cookie值或null
 */
export async function getCookie(ctx: Context, key: string) {
  const signedCookie = await getSignedCookie(ctx, key, privateKey);
  if (!signedCookie) return null;
  return signedCookie;
}
