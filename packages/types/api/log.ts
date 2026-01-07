import type { SortDirection } from ".";

export interface LogItemApi {
  id: string;
  url: string;
  method: string;
  params: Record<string, any>;
  requestIp: string;
  isSecure: boolean;
  language: string;
  userAgent: string;
  headers: Record<string, string>;
  response: string;
  isSuccess: boolean;
  reason: string;
  createAt: Date;
}

export type LogPageIsSuccessFilter = "all" | "success" | "failed";

export type LogPageRequestTypeFilter = "all" | "get" | "post" | "delete";

export interface LogPageWithFilterApi {
  cur: number;
  size: number;
  urlFilter: string;
  isSuccessFilter: LogPageIsSuccessFilter;
  requestTypeFilter: LogPageRequestTypeFilter;
  createAtSort: SortDirection;
}

export interface LogPageApi {
  list: LogItemApi[];
  count: number;
}

export interface LocalLogItem {
  level: string;
  message: string;
  timestamp: string;
}
