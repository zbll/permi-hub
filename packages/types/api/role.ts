export interface RoleItemApi {
  role: string;
  description: string;
  permissions: string[];
  createAt: Date;
}

export interface RolePageApi {
  list: RoleItemApi[];
  count: number;
}
