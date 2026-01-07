import type { PermissionItemApi } from "./permission.ts";

export interface RoleItemApi {
  id: number;
  role: string;
  description: string;
  permissions: PermissionItemApi[];
  createAt: Date;
}
