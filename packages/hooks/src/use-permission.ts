import { Permissions } from "@packages/types";
import type { PermissionJson } from "@packages/types/permission";

/**
 * 检查用户是否有足够的权限
 * @param aPermission 用户权限
 * @param bPermission 需要的权限
 * @returns 是否有足够的权限
 * @example
 * checkPermission("admin", "admin") // true
 * checkPermission("user", "admin") // false
 * checkPermission("user", "user:read") // true
 * checkPermission("user:read", "user:write") // false
 * checkPermission("user:permission", "user:permission:read") // true
 */
export function checkPermission(
  aPermission: string,
  bPermission: string,
): boolean {
  return aPermission === bPermission || bPermission.startsWith(aPermission);
}

export class PermissionOptionalObject {
  private optional: Record<string, boolean> = {};
  constructor(private needPermissions: Permissions[]) {
    needPermissions.forEach((u) => (this.optional[u] = false));
  }

  toValue(): Record<Permissions, boolean> {
    return this.optional;
  }

  toFalse(): Record<Permissions, false> {
    for (const key in this.optional) {
      this.optional[key] = false;
    }
    return this.optional as Record<Permissions, false>;
  }

  toTrue(): Record<Permissions, true> {
    for (const key in this.optional) {
      this.optional[key] = true;
    }
    return this.optional as Record<Permissions, true>;
  }

  setTrue(permission: Permissions) {
    this.optional[permission] = true;
  }

  setFalse(permission: Permissions) {
    this.optional[permission] = false;
  }

  setValue(permission: Permissions, value: boolean) {
    this.optional[permission] = value;
  }
}

export function usePermission() {
  /**
   * 检查用户是否有足够的权限
   * @param needPermissions 需要的权限列表
   * @param permissions 用户权限列表
   * @returns 是否有足够的权限
   */
  const checkPermissions = (
    needPermissions: string[],
    permissions: string[],
  ) => {
    if (permissions.some((u) => u === Permissions.Admin)) return true;
    if (
      !needPermissions.some((u) =>
        permissions.some((p) => checkPermission(p, u)),
      )
    ) {
      return false;
    }
    return true;
  };

  const checkOptionalPermissions = (
    needPermissions: string[],
    permissions: string[],
  ) => {
    const optionalObj = new PermissionOptionalObject(
      needPermissions as Permissions[],
    );
    if (
      needPermissions.length === 0 ||
      permissions.some((u) => u === Permissions.Admin)
    ) {
      return optionalObj.toTrue();
    }
    if (permissions.length === 0) {
      return optionalObj.toFalse();
    }
    needPermissions.forEach((u) => {
      optionalObj.setValue(
        u as Permissions,
        permissions.some((p) => checkPermission(p, u)),
      );
    });
    return optionalObj.toValue();
  };

  /**
   * 获取用户缺少的权限
   * @param needPermissions 需要的权限列表
   * @param permissions 用户权限列表
   * @returns 用户缺少的权限字符串
   */
  const fetchPermissionsMissingByUser = (
    needPermissions: string[],
    permissions: string[],
  ) =>
    needPermissions
      .filter((u) => !permissions.some((p) => checkPermission(p, u)))
      .join(", ");

  return {
    checkPermissions,
    checkOptionalPermissions,
    fetchPermissionsMissingByUser,
  };
}

export function usePermissionJson<T extends PermissionJson>(json: T) {
  const { checkPermissions, checkOptionalPermissions } = usePermission();

  const getNeedPermission = (id: keyof T) => {
    return json[id];
  };

  const checkPermissionById = (
    id: keyof T,
    permission: Permissions[],
  ): { required: boolean; optional: Record<string, boolean> } => {
    const needPermissions = getNeedPermission(id);
    if (!checkPermissions(needPermissions.required, permission)) {
      const optional = new PermissionOptionalObject(
        needPermissions.optional ?? [],
      ).toFalse();
      return { required: false, optional };
    }
    const optional = checkOptionalPermissions(
      needPermissions.optional ?? [],
      permission,
    );
    return { required: true, optional: optional };
  };
  return {
    getNeedPermission,
    checkPermissionById,
  };
}
