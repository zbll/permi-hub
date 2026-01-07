import type {
  UserItemApi,
  UserInfoApi,
  UserAddApi,
  UserLoginApi,
  CurrentUserEditApi,
} from "@packages/types";
import { requestClient } from "../request-client";

export class UserService {
  static async list() {
    const response = await requestClient.get<UserItemApi[]>("/user/list");
    return response.data;
  }

  static async isAuth() {
    const response = await requestClient.get<boolean>("/user/authenticate");
    return response.data;
  }

  static async login(value: UserLoginApi) {
    const formData = new FormData();
    formData.append("email", value.email);
    formData.append("password", value.password);
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

  static async deleteUser(id: string) {
    const response = await requestClient.delete(`/user/${id}`);
    return response.data;
  }

  static async get(id: string) {
    const response = await requestClient.get<UserItemApi>(`/user/view/${id}`);
    return response.data;
  }

  static async add(value: UserAddApi) {
    const formData = new FormData();
    formData.append("nickname", value.nickname);
    formData.append("email", value.email);
    formData.append("password", value.password);
    formData.append("emailCode", value.emailCode);
    value.roles.map((role) => formData.append("role", role.toString()));
    const response = await requestClient.post<UserItemApi>(
      "/user/add",
      formData,
    );
    return response.data;
  }

  static async edit(value: CurrentUserEditApi) {
    const formData = new FormData();
    formData.append("nickname", value.nickname);
    formData.append("email", value.email);
    const response = await requestClient.post<UserItemApi>(
      "/user/edit",
      formData,
    );
    return response.data;
  }
}
