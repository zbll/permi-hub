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
