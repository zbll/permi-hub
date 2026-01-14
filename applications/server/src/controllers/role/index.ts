import { Hono } from "hono";
import { useAuth, useCheckPermissionById } from "../../easy-middlewares.ts";
import { Permissions, RequestError } from "@packages/types";
import { validator } from "hono/validator";
import { useRequestValidator } from "@packages/hooks";
import { i18n, validatorOptions } from "~locale";
import { PermissionService } from "~services/permission/PermissionService.ts";
import { RoleService } from "~services/role/RoleService.ts";

// 创建角色管理路由实例
const router = new Hono();

// 添加角色接口
// 需要认证和角色添加权限
router.post(
  "/add",
  useAuth(), // 认证中间件
  useCheckPermissionById("role-add"), // 权限检查中间件
  // 请求参数验证
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    // 权限ID数组
    const permissions = required("permissions").isArray().toValue<string[]>();
    // 角色名称
    const role = required("role").type("string").toString();
    // 角色描述
    const description = required("description").type("string").toString();
    return {
      permissions,
      role,
      description,
    };
  }),
  // 处理添加角色请求
  async (ctx) => {
    const { permissions, role, description } = ctx.req.valid("form");

    // 根据权限ID获取权限实体
    const [canFind, permissionEntities] =
      await PermissionService.creates(permissions);
    if (!canFind)
      throw new RequestError(i18n.t("role.add.error.permission.not.exists"));

    // 添加角色
    const [success, roleEntity] = await RoleService.add(
      role,
      permissionEntities.filter((u) => u.permission !== Permissions.Admin),
      description,
    );
    if (!success) throw new RequestError(i18n.t("role.add.error"));
    return ctx.json(roleEntity);
  },
);

// 获取角色接口
// 需要认证和角色获取权限
router.get(
  "/data/:id", // 根据ID获取角色
  useAuth(), // 认证中间件
  useCheckPermissionById("role-get"), // 权限检查中间件
  async (ctx) => {
    const id = ctx.req.param("id"); // 获取路径参数中的角色ID
    const [success, role] = await RoleService.get(Number(id));
    if (!success) throw new RequestError(i18n.t("role.get.error.not.exists"));
    return ctx.json(role);
  },
);

// 删除角色接口
// 需要认证和角色删除权限
router.delete(
  "/:id", // 根据ID删除角色
  useAuth(), // 认证中间件
  useCheckPermissionById("role-delete"),
  async (ctx) => {
    const id = ctx.req.param("id"); // 获取路径参数中的角色ID
    const [success, role] = await RoleService.delete(Number(id));
    if (!success)
      throw new RequestError(i18n.t("role.delete.error.not.exists"));
    return ctx.json(role);
  },
);

// 编辑角色接口
// 需要认证和角色编辑权限
router.post(
  "/edit/:id", // 根据ID编辑角色
  useAuth(), // 认证中间件
  useCheckPermissionById("role-edit"),
  // 请求参数验证
  validator("form", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    // 权限ID数组
    const permissions = required("permissions").isArray().toValue<string[]>();
    // 角色名称
    const role = required("role").type("string").toString();
    // 角色描述
    const description = required("description").type("string").toString();
    return {
      permissions,
      role,
      description,
    };
  }),
  // 处理编辑角色请求
  async (ctx) => {
    const id = ctx.req.param("id"); // 获取路径参数中的角色ID
    const { permissions, role, description } = ctx.req.valid("form");

    const [canFind, rolData] = await RoleService.getWithPermissions(Number(id));
    if (!canFind) throw new RequestError(i18n.t("role.edit.error.not.exists"));
    const { data: roleEntity, permissions: deletePermissionEntities } = rolData;

    const [canFindPermission] = await PermissionService.deletes(
      deletePermissionEntities,
    );
    if (!canFindPermission)
      throw new RequestError(i18n.t("role.edit.error.permission.delete.error"));

    const [saveSuccess, permissionEntities] =
      await PermissionService.creates(permissions);
    if (!saveSuccess)
      throw new RequestError(i18n.t("role.edit.error.permission.create.error"));

    // 更新角色信息
    roleEntity.role = role;
    roleEntity.description = description;
    roleEntity.permissions = permissionEntities.filter(
      (u) => u.permission !== Permissions.Admin,
    );

    // 保存修改后的角色
    const [success, editEntity] = await RoleService.edit(roleEntity);
    if (!success) throw new RequestError(i18n.t("role.edit.error"));
    return ctx.json(editEntity);
  },
);

router.get(
  "/list",
  useAuth(),
  useCheckPermissionById("role-get"),
  async (ctx) => {
    const [success, roles] = await RoleService.list();
    if (!success) throw new RequestError(i18n.t("role.list.error"));
    return ctx.json(roles);
  },
);

// 导出角色管理路由
export default router;
