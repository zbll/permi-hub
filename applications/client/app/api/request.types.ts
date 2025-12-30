import { ResultCode } from "@packages/types";



export interface Result<T> {
  code: ResultCode;
  message: string;
  data: T | null;
}
