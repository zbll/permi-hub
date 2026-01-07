// 导入数据库连接和实体类
import { AppDataSource } from "~data-source";
import { User } from "~entity/User.ts";

// 导入 Redis 客户端用于 token 管理
import { redisClient } from "~redis";

// 导入工具函数
import { usePatience } from "@packages/hooks";
import { createToken } from "@packages/token";
import type { Context } from "hono";
import { env } from "~env";
import { i18n } from "~locale";
import { checkUserToken, setUserToken } from "../../utils/utils.ts";
import { type UserInfoApi, RequestError, Permissions } from "@packages/types";
import { RoleService } from "../role/RoleService.ts";
import { md5 } from "@packages/encryption";
import { Logger } from "~logger";

/**
 * 用户服务类
 * 提供用户相关的业务逻辑操作，包括登录、注册、信息查询等
 */
export class UserService {
  /**
   * 根据邮箱和密码获取用户信息（私有方法）
   *
   * @param email 用户邮箱
   * @param password 用户密码
   * @returns 用户实体对象
   */
  private static getUserByEmail(email: string, password: string) {
    return AppDataSource.manager.findOneOrFail(User, {
      where: {
        email,
        password,
      },
    });
  }

  /**
   * 检查邮箱是否已存在（私有方法）
   *
   * @param email 要检查的邮箱地址
   * @returns 用户实体对象（如果存在）
   */
  static checkHaveEmail(email: string) {
    return usePatience(
      AppDataSource.manager.findOneOrFail(User, {
        where: {
          email,
        },
      }),
    );
  }

  /**
   * 更新用户信息（私有方法）
   *
   * @param user 用户实体对象
   * @returns 数据库更新操作结果
   */
  private static update(user: User) {
    return AppDataSource.manager.save(user);
  }

  /**
   * 根据 token 获取用户信息
   *
   * @param token 用户认证令牌
   * @returns 用户实体对象
   * @throws 如果 token 无效则抛出错误
   */
  static async fromToken(token: string) {
    // 从 Redis 中获取用户ID
    const id = await redisClient.get(token);
    if (!id) throw new RequestError(i18n.t("token.invalid"));
    const hasToken = await checkUserToken(id, token);
    if (!hasToken) throw new RequestError(i18n.t("token.invalid"));

    // 根据用户ID查询用户信息
    return AppDataSource.manager.findOneOrFail(User, {
      where: {
        id,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }

  /**
   * 检查用户IP是否中途已变更
   *
   * @param user 用户实体对象
   * @param currentIP 当前请求IP地址
   * @returns 如果IP已变更则返回 true，否则返回 false
   */
  static isChangeIp(user: User, currentIP: string | undefined) {
    if (user.ip !== currentIP) return true;
    return false;
  }

  /**
   * 用户登录
   *
   * @param ip 用户IP地址（可选）
   * @param email 用户邮箱
   * @param password 用户密码
   * @returns 包含 token 和用户ID的对象
   * @throws 如果邮箱或密码错误则抛出异常
   */
  static async login(ip: string | undefined, email: string, password: string) {
    // 验证邮箱和密码
    const [success, user] = await usePatience(
      this.getUserByEmail(email, password),
    );
    if (!success) throw new RequestError(i18n.t("user.login.error"));

    // 如果提供了IP地址，则更新用户IP
    if (ip) {
      user.ip = ip;
    }

    // 更新用户最后登录时间
    user.lastLoginAt = new Date();

    const [successUpdate] = await usePatience(this.update(user));
    if (!successUpdate) throw new RequestError(i18n.t("user.login.error"));

    const token = await createToken(user.id);

    // 存储用户 token 到 Redis
    await setUserToken(user.id, token);

    // 返回认证令牌
    return token;
  }

  /**
   * 添加用户
   *
   * @param user 用户实体对象
   * @returns 保存后的用户实体对象
   */
  static add(user: User) {
    return AppDataSource.manager.save(user);
  }

  /**
   * 获取用户公开信息
   * 过滤敏感信息，只返回可公开的用户数据
   *
   * @param user 用户实体对象
   * @returns 包含用户公开信息的对象
   */
  static getInfo(user: User): UserInfoApi {
    return {
      nickname: user.nickname,
      email: user.email,
      createAt: user.createAt,
    };
  }

  static getToken(ctx: Context): string | undefined {
    const token = ctx.req.header(env.AUTH_HEADER_NAME);
    if (token) {
      return token.split(" ")[1];
    }
    return undefined;
  }

  static #isInit = false;
  static #Admin = new User();

  static async init() {
    if (this.#isInit) return;
    this.#isInit = true;
    Logger.info("初始化Admin用户中...");
    await RoleService.init();
    const user = await AppDataSource.manager.findOne(User, {
      where: {
        email: env.ADMIN_EMAIL,
      },
    });
    if (user === null) {
      Logger.info("Admin用户不存在, 创建中...");
      const admin = new User();
      admin.email = env.ADMIN_EMAIL;
      admin.password = md5(env.ADMIN_PASSWORD);
      admin.nickname = Permissions.Admin;
      admin.roles = [RoleService.getAdmin()];
      admin.ip = "";
      const newAdmin = await AppDataSource.manager.save(admin);
      Logger.info(
        `Admin用户创建成功, ID: ${newAdmin.id}, 邮箱: ${newAdmin.email}, 密码: ${newAdmin.password}`,
      );
      this.#Admin = newAdmin;
    } else {
      if (user.password !== md5(env.ADMIN_PASSWORD)) {
        user.password = md5(env.ADMIN_PASSWORD);
        await AppDataSource.manager.save(user);
      }
      this.#Admin = user;
      Logger.info(
        `Admin用户已存在, ID: ${user.id}, 邮箱: ${user.email}, 密码: ${user.password}`,
      );
    }
  }

  static getAdmin() {
    return this.#Admin;
  }

  /**
   * 获取用户列表
   *
   * @returns 用户列表
   */
  static async list() {
    const users = await AppDataSource.manager.find(User, {
      relations: {
        roles: true,
      },
    });
    return users;
  }

  static get(id: string) {
    return usePatience(
      AppDataSource.manager.findOneOrFail(User, {
        where: {
          id,
        },
        relations: {
          roles: {
            permissions: true,
          },
        },
      }),
    );
  }

  static edit(user: User) {
    return usePatience(AppDataSource.manager.save(user));
  }

  static delete(id: string) {
    if (id === this.#Admin.id) {
      throw new RequestError(i18n.t("user.delete.error.admin"));
    }
    return usePatience(AppDataSource.manager.delete(User, { id }));
  }
}
