import type { RoleItemApi } from "@packages/types";
import { requestClient } from "../request-client";

export class RoleService {
  static async list() {
    const response = await requestClient.get<RoleItemApi[]>("/role/list");
    return response.data;
  }

  static async add(formData: FormData) {
    const response = await requestClient.post<RoleItemApi>(
      "/role/add",
      formData,
    );
    return response.data;
  }

  static async edit({ id, formData }: { id: number; formData: FormData }) {
    const response = await requestClient.post<RoleItemApi>(
      `/role/edit/${id}`,
      formData,
    );
    return response.data;
  }

  static async get(id: number) {
    const response = await requestClient.get<RoleItemApi>(`/role/data/${id}`);
    return response.data;
  }

  static async delete(id: number) {
    const response = await requestClient.delete<RoleItemApi>(
      `/role/delete/${id}`,
    );
    return response.data;
  }
}
