import axios, { AxiosError } from "axios";
import i18next from "i18next";
import { ResultCodeStatus } from "@packages/types";
import { Result } from "@packages/types";
import { toast } from "sonner";
import { getAuthToken } from "~/lib/utils";
import { queryClient } from "~/lib/query-client";

export const requestClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

requestClient.interceptors.request.use(async (config) => {
  config.headers.set("Accept-Language", i18next.language);
  config.headers.set("Authorization", `Bearer ${await getAuthToken()}`);
  return config;
});

requestClient.interceptors.response.use(
  (value) => {
    if (Result.isResult(value.data)) value.data = value.data.data;
    return value;
  },
  (error) => {
    if (!(error instanceof AxiosError)) throw error;
    if (error.config?.headers?.get("X-Show-Spinner") === "false") throw error;
    if (!Result.isResult(error.response?.data)) throw error;
    switch (error.status) {
      case ResultCodeStatus.AuthError:
        // 未登录
        if (error.config?.url === "/user/authenticate") break;
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        break;
      case ResultCodeStatus.PermissionError:
        // 权限错误
        toast.error(error.response.data.message, {
          position: "top-center",
        });
        break;
      case ResultCodeStatus.RequestError:
      case ResultCodeStatus.ServerError:
        // 服务器错误
        // 请求错误
        toast.error(error.response.data.message, {
          position: "top-center",
        });
        break;
    }
  },
);
