import type {
  LocalLogItem,
  LogItemApi,
  LogPageApi,
  LogPageWithFilterApi,
} from "@packages/types";
import { requestClient } from "../request-client";

export class LogService {
  static async page(option: LogPageWithFilterApi) {
    const response = await requestClient.get<LogPageApi>("/log/page", {
      params: {
        cur: option.cur,
        size: option.size,
        filter: option.urlFilter,
        time: option.createAtSort,
        success: option.isSuccessFilter,
        method: option.requestTypeFilter,
      },
    });
    return response.data;
  }

  static async view(id: string) {
    const response = await requestClient.get<LogItemApi>(`/log/${id}`, {
      headers: {
        "X-Show-Spinner": "false",
      },
    });
    return response.data;
  }

  static async getLocalLogs(cur = 1, size = 20) {
    const response = await requestClient.get<{
      list: LocalLogItem[];
      count: number;
    }>("/log/locale/logger/list", { params: { cur, size } });
    return response.data;
  }
}
