import { removeAuthToken, setAuthToken } from "~/lib/utils";
import { requestClient } from "../request-client";
import type { UserInfoApi } from "@packages/types/api/user";

export class UserService {
  static async login(formData: FormData) {
    const response = await requestClient.post<string>("/user/login", formData);
    const token = response.data;
    setAuthToken(token);
    return token;
  }

  static async isAuth() {
    const response = await requestClient.get<true>("/user/logged");
    return response.data;
  }

  static async permission() {
    const response = await requestClient.get<string[]>("/user/permissions");
    return response.data;
  }

  static async info() {
    const response = await requestClient.get<UserInfoApi>("/user/info");
    return response.data;
  }

  static async logout() {
    const response = await requestClient.get<true>("/user/logout");
    removeAuthToken();
    return response.data;
  }
}
