import { Permissions } from "@packages/types";

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

  /**
   * 获取用户缺少的权限
   * @param needPermissions 需要的权限列表
   * @param permissions 用户权限列表
   * @returns 用户缺少的权限字符串
   */
  const getNeedPermissions = (
    needPermissions: string[],
    permissions: string[],
  ) =>
    needPermissions
      .filter((u) => !permissions.some((p) => checkPermission(p, u)))
      .join(", ");

  return {
    checkPermissions,
    getNeedPermissions,
  };
}
