// 用户控制器模块 - 处理用户相关的HTTP请求
import { Hono } from "hono";
import { AppDataSource } from "~data-source";
import { User } from "~entity/User.ts";
import { UserService } from "../../services/user/UserService.ts";
import { env } from "~env";
import { useAuth, type AuthVar } from "../../easy-middlewares.ts";

import { md5 } from "@packages/encryption";
import { validator } from "hono/validator";
import { useRequestValidator } from "@packages/hooks";
import { validatorOptions, i18n } from "~locale";
import { type ConnectInfoVar } from "@packages/types";
import { removeUserToken } from "../../utils.ts";

// 创建用户路由实例，定义变量类型
const router = new Hono<{
  Variables: ConnectInfoVar & AuthVar;
}>();

// 获取用户列表接口
router.get("/list", async (ctx) => {
  // 从数据库获取所有用户
  const list = await AppDataSource.manager.find(User);
  // 返回JSON格式的用户列表
  return ctx.json(list);
});

// 用户登录接口
router.post(
  "/login",
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const email = required("email").type("string").toValue<string>();
    const password = required("password").type("string").toValue<string>();
    return {
      email,
      password,
    };
  }),
  async (ctx) => {
    // 从表单数据中获取邮箱和密码
    const { email, password } = ctx.req.valid("form");
    // 获取客户端IP地址
    const ip = ctx.var.connectInfo?.remote.address || "";
    // 调用用户服务进行登录验证
    const token = await UserService.login(ip, email, md5(password));
    // 设置认证头
    ctx.header(env.AUTH_HEADER_NAME, token);
    // 返回登录成功结果
    return ctx.json(token);
  },
);

// 用户注册接口
router.post(
  "/register",
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const nickname = required("nickname").type("string").toValue<string>();
    const email = required("email").type("string").toValue<string>();
    const password = required("password").type("string").toValue<string>();
    return {
      nickname,
      email,
      password,
    };
  }),
  async (ctx) => {
    // 从表单数据中获取昵称、邮箱和密码
    const { nickname, email, password } = ctx.req.valid("form");
    // 验证参数类型
    if (
      typeof nickname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      throw new Error(i18n.t("user.register.field.empty"));
    }
    // 获取客户端IP地址
    const ip = ctx.var.connectInfo?.remote.address || "";
    // 调用用户服务进行注册
    const result = await UserService.register(
      ip,
      nickname,
      email,
      md5(password),
    );
    // 返回注册结果
    return ctx.json(result);
  },
);

// 获取用户信息接口（需要认证）
router.get("/info", useAuth(), (ctx) => {
  // 从认证中间件中获取用户信息
  const user = ctx.var.user;
  // 返回用户公开信息
  return ctx.json(UserService.getInfo(user));
});

// 验证认证接口（需要认证）
router.get("/authenticate", useAuth(), (ctx) => {
  return ctx.json(true);
});

// 用户登出接口（需要认证）
router.get("/logout", useAuth(), async (ctx) => {
  const token = UserService.getToken(ctx);
  if (token) {
    const user = ctx.var.user;
    await removeUserToken(user.id, token);
  }
  ctx.header(env.AUTH_HEADER_NAME, undefined);
  ctx.header(env.AUTH_HEADER_NAME.toLowerCase(), undefined);
  ctx.header(env.AUTH_HEADER_NAME.toUpperCase(), undefined);
  return ctx.json(true);
});

// 验证用户是否登录接口（需要认证）
router.get("/logged", useAuth(), (ctx) => ctx.json(true));

router.get("/permissions", useAuth(), (ctx) => {
  const roles = ctx.var.user.roles;
  const permissions = roles.flatMap((role) =>
    role.permissions.map((p) => p.permission),
  );
  return ctx.json(permissions);
});

// 导出路由实例
export default router;
