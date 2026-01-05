import type { PermissionItemApi } from "./permission";

export interface RoleItemApi {
  id: number;
  role: string;
  description: string;
  permissions: PermissionItemApi[];
  createAt: Date;
}
