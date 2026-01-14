export enum Permissions {
  Admin = "admin",
  Logger = "logger",
  LoggerGet = "logger:get",
  Locale = "locale",
  LocaleLogger = "locale:logger",
  Role = "role",
  RoleGet = "role:get",
  RoleAdd = "role:add",
  RoleEdit = "role:edit",
  RoleDelete = "role:delete",
  Permission = "permission",
  PermissionGet = "permission:get",
  PermissionAdd = "permission:add",
  PermissionDelete = "permission:delete",
  User = "user",
  UserGet = "user:get",
  UserAdd = "user:add",
  UserEdit = "user:edit",
  UserDelete = "user:delete",
}

export type PermissionData = {
  required: Permissions[];
  optional?: Permissions[];
};

export type PermissionJson = Record<string, PermissionData>;
