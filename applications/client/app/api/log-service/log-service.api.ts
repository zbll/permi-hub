import type { LogItemApi, LogPageApi, SortDirection } from "@packages/types";
import { requestClient } from "../request-client";

export class LogService {
  static async page(cur: number, size: number, createAtSort: SortDirection) {
    const response = await requestClient.get<LogPageApi>("/log/page", {
      params: {
        cur,
        size,
        time: createAtSort,
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
}
