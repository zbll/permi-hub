export * from "./user.ts";
export * from "./result.ts";
export * from "./log.ts";

export enum ResultCode {
  Ok = "ok",
  ServerError = "server_error",
  AuthError = "auth_error",
  PermissionError = "permission_error",
  RequestError = "request_error",
}

export enum ResultCodeStatus {
  Ok = 200,
  ServerError = 500,
  AuthError = 401,
  PermissionError = 403,
  RequestError = 400,
}

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}
