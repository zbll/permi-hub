import type { UserItemApi, UserInfoApi } from "@packages/types";
import { requestClient } from "../request-client";

export class UserService {
  static async list() {
    const response = await requestClient.get<UserItemApi[]>("/user/list");
    return response.data;
  }

  static async register(formData: FormData) {
    const response = await requestClient.post<UserItemApi>(
      "/user/register",
      formData,
    );
    return response.data;
  }

  static async isAuth() {
    const response = await requestClient.get<boolean>("/user/authenticate");
    return response.data;
  }

  static async login(formData: FormData) {
    const response = await requestClient.post<string>("/user/login", formData);
    return response.data;
  }

  static async logout() {
    const response = await requestClient.get<boolean>("/user/logout");
    return response.data;
  }

  static async info() {
    const response = await requestClient.get<UserInfoApi>("/user/info");
    return response.data;
  }

  static async permission() {
    const response = await requestClient.get<string[]>("/user/permissions");
    return response.data;
  }
}
