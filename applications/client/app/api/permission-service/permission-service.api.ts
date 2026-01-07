import type { PermissionItemApi } from "@packages/types";
import { requestClient } from "../request-client";

export class PermissionService {
  static async get() {
    const response =
      await requestClient.get<PermissionItemApi[]>("/permission/list");
    console.log(response);
    return response.data;
  }
}
