import { Permissions } from "@packages/types";

export const permissionJson = {
  "logger-get": {
    required: [Permissions.LoggerGet],
  },
  "local-logger-get": {
    required: [Permissions.LocaleLogger],
  },
  "permission-get": {
    required: [Permissions.PermissionGet],
  },
  "role-get": {
    required: [Permissions.RoleGet],
  },
  "role-add": {
    required: [Permissions.RoleAdd, Permissions.PermissionAdd],
  },
  "role-delete": {
    required: [Permissions.RoleDelete],
  },
  "role-edit": {
    required: [
      Permissions.RoleGet,
      Permissions.RoleEdit,
      Permissions.PermissionGet,
      Permissions.PermissionDelete,
      Permissions.PermissionAdd,
    ],
  },
  "user-get": {
    required: [Permissions.UserGet],
    optional: [Permissions.RoleGet, Permissions.PermissionGet],
  },
  "user-add": {
    required: [Permissions.UserAdd, Permissions.RoleGet],
  },
  "user-edit": {
    required: [Permissions.UserGet, Permissions.RoleGet],
  },
  "user-delete": {
    required: [Permissions.UserGet, Permissions.UserDelete],
  },
  "user-edit-myself": {
    required: [Permissions.UserEdit],
  },
} as const;
