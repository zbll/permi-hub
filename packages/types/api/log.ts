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

export interface LogPageApi {
  list: LogItemApi[];
  count: number;
}
