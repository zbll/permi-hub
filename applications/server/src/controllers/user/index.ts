// 导入必要的模块
import { Hono } from "hono";
import { UserService } from "../../services/user/UserService.ts";
import { EmailCodeService } from "../../services/user/EmailCodeService.ts";
import { env } from "~env";
import {
  useAuth,
  type AuthVar,
  type ConnInfo,
} from "../../easy-middlewares.ts";

import { md5 } from "@packages/encryption";
import { validator } from "hono/validator";
import { useRequestValidator } from "@packages/hooks";
import { validatorOptions, i18n } from "~locale";
import { removeUserToken } from "../../utils/utils.ts";

import {
  Permissions,
  type ConnectInfoVar,
  ServerError,
  RequestError,
} from "@packages/types";
import { useCheckPermission } from "../../easy-middlewares.ts";
import { RoleService } from "~services/role/RoleService.ts";
import { User } from "~entity/User.ts";

// 创建用户路由实例，定义变量类型
const router = new Hono<{
  Variables: ConnectInfoVar<ConnInfo> & AuthVar;
}>();

// 发送邮箱验证码接口
router.post(
  "/send-code",
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const email = required("email").type("string").toValue<string>();
    return { email };
  }),
  async (ctx) => {
    const { email } = ctx.req.valid("form");
    const result = await EmailCodeService.send(email);
    if (!result)
      throw new ServerError(i18n.t("user.register.mail.send.failed"));
    return ctx.json(true);
  },
);

// 获取用户列表接口
router.get(
  "/list",
  useAuth(),
  useCheckPermission([Permissions.UserGet]),
  async (ctx) => {
    // 从数据库获取所有用户
    const list = await UserService.list();
    // 返回JSON格式的用户列表
    return ctx.json(list);
  },
);

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
    const emailCode = required("emailCode").type("string").toValue<string>();
    return {
      nickname,
      email,
      password,
      emailCode,
    };
  }),
  async (ctx) => {
    // 从表单数据中获取昵称、邮箱、密码和验证码
    const { nickname, email, password, emailCode } = ctx.req.valid("form");
    // 验证参数类型
    if (
      typeof nickname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof emailCode !== "string"
    ) {
      throw new Error(i18n.t("user.register.field.empty"));
    }

    // 检查邮箱是否已存在
    const [canFind] = await UserService.checkHaveEmail(email);
    if (canFind) {
      throw new RequestError(i18n.t("user.register.email.exists"));
    }

    // 验证邮箱验证码
    const isCodeValid = await EmailCodeService.verify(email, emailCode);
    if (!isCodeValid) {
      throw new RequestError(i18n.t("user.register.code.invalid"));
    }

    // 获取客户端IP地址
    const ip = ctx.var.connectInfo?.remote.address || "";
    const user = new User();
    user.nickname = nickname;
    user.password = md5(password);
    user.email = email;
    user.ip = ip;
    user.roles = [];
    // 调用用户服务进行注册
    const result = await UserService.add(user);
    // 返回注册结果
    return ctx.json(result);
  },
);

router.post(
  "/add",
  useAuth(),
  useCheckPermission([Permissions.UserAdd]),
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const nickname = required("nickname").type("string").toValue<string>();
    const email = required("email").type("string").toValue<string>();
    const emailCode = required("emailCode").type("string").toValue<string>();
    const password = required("password").type("string").toValue<string>();
    const role = required("role").toValue<number[]>();
    return {
      nickname,
      email,
      emailCode,
      password,
      role,
    };
  }),
  async (ctx) => {
    const { nickname, email, emailCode, password, role } =
      ctx.req.valid("form");
    const [have] = await UserService.checkHaveEmail(email);
    if (have) {
      throw new RequestError(i18n.t("user.register.email.exists"));
    }

    // 验证邮箱验证码
    const isCodeValid = await EmailCodeService.verify(email, emailCode);
    if (!isCodeValid) {
      throw new RequestError(i18n.t("user.register.code.invalid"));
    }

    const [canFind, roles] = await RoleService.getRolesFromIds(role);
    if (!canFind) {
      throw new RequestError(i18n.t("role.view.error.not.exists"));
    }

    const ip = ctx.var.connectInfo?.remote.address || "";

    const user = new User();
    user.nickname = nickname;
    user.password = md5(password);
    user.email = email;
    user.ip = ip;
    user.roles = roles;
    const result = await UserService.add(user);
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

router.get(
  "/view/:id",
  useAuth(),
  useCheckPermission([Permissions.UserGet]),
  async (ctx) => {
    const id = ctx.req.param("id");
    if (!id) throw new RequestError(i18n.t("user.view.field.id.empty"));
    const [, user] = await UserService.get(id);
    return ctx.json(user);
  },
);

router.post(
  "/edit/:id",
  useAuth(),
  useCheckPermission([Permissions.UserEdit]),
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const nickname = required("nickname").string().toString();
    const email = required("email").string().email().toString();
    const role = required("role").toValue<number[]>();
    return {
      nickname,
      email,
      role,
    };
  }),
  async (ctx) => {
    const { nickname, email, role } = ctx.req.valid("form");
    const id = ctx.req.param("id");
    if (!id) throw new RequestError(i18n.t("user.view.field.id.empty"));
    const [canFind, user] = await UserService.get(id);
    if (!canFind) throw new RequestError(i18n.t("user.view.error.not.exists"));
    const [canFindRoles, roles] = await RoleService.getRolesFromIds(role);
    if (!canFindRoles)
      throw new RequestError(i18n.t("role.view.error.not.exists"));
    user.nickname = nickname;
    user.email = email;
    user.roles = roles;
    const [success, data] = await UserService.edit(user);
    if (!success) throw new RequestError(i18n.t("user.edit.error"));
    return ctx.json(data);
  },
);

router.delete(
  "/:id",
  useAuth(),
  useCheckPermission([Permissions.UserDelete]),
  async (ctx) => {
    const id = ctx.req.param("id");
    const [canFind] = await UserService.get(id);
    if (!canFind) throw new RequestError(i18n.t("user.view.error.not.exists"));
    const [success] = await UserService.delete(id);
    return ctx.json(success);
  },
);

router.post(
  "/edit",
  useAuth(),
  useCheckPermission([Permissions.UserEdit]),
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const nickname = required("nickname").string().toString();
    const email = required("email").string().email().toString();
    return {
      nickname,
      email,
    };
  }),
  async (ctx) => {
    const { nickname, email } = ctx.req.valid("form");
    const user = ctx.var.user;
    user.nickname = nickname;
    user.email = email;
    const [success, data] = await UserService.edit(user);
    if (!success) throw new RequestError(i18n.t("user.edit.error"));
    return ctx.json(data);
  },
);

// 导出路由实例
export default router;
