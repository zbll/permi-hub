var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../types/api/index.ts
var ResultCode = /* @__PURE__ */ function(ResultCode2) {
  ResultCode2["Ok"] = "ok";
  ResultCode2["ParamError"] = "param_error";
  ResultCode2["ServerError"] = "server_error";
  ResultCode2["AuthError"] = "auth_error";
  ResultCode2["PermissionError"] = "permission_error";
  return ResultCode2;
}({});

// src/result.ts
var Result = class extends Error {
  /**
   * 响应数据
   */
  data = null;
  /**
   * 将结果转换为 JSON 字符串
   */
  toString() {
    return JSON.stringify(this);
  }
  /**
   * 结果代码
   */
  _code = ResultCode.Ok;
  /**
   * HTTP 状态码
   */
  _statusCode = 200;
  /**
   * 获取结果代码
   */
  get code() {
    return this._code;
  }
  /**
   * 设置结果代码，并自动更新 HTTP 状态码
   */
  set code(value) {
    this._code = value;
    this._statusCode = this.getStatusCode();
  }
  /**
   * 获取 HTTP 状态码
   */
  get statusCode() {
    return this._statusCode;
  }
  /**
   * 设置响应消息
   */
  setMessage(message) {
    this.message = message;
    return this;
  }
  /**
   * 设置结果代码
   */
  setCode(code) {
    this.code = code;
    return this;
  }
  /**
   * 根据结果代码获取对应的 HTTP 状态码
   */
  getStatusCode() {
    switch (this.code) {
      case ResultCode.Ok:
        return 200;
      case ResultCode.ParamError:
        return 400;
      case ResultCode.AuthError:
        return 401;
      default:
        return 500;
    }
  }
  /**
   * 转换为响应体格式
   */
  toBody() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
  /**
   * 渲染响应
   */
  render(response) {
    response.status = this.statusCode;
    response.body = JSON.stringify(this.toBody());
    return this.toBody();
  }
  /**
   * 判断一个值是否为 Result 实例
   */
  static isResult(value) {
    if (value && typeof value === "object") {
      return Boolean(value.code && value.message && "data" in value);
    }
    return false;
  }
};
var OkResult = class extends Result {
  /**
   * 创建成功结果
   * @param data 响应数据
   */
  constructor(data) {
    super();
    this.code = ResultCode.Ok;
    this.data = data;
  }
};
var baseError = new Result();
function paramErrorResult(message) {
  return baseError.setMessage(message).setCode(ResultCode.ParamError).toBody();
}
function serverErrorResult(message) {
  return baseError.setMessage(message).setCode(ResultCode.ServerError).toBody();
}
function authErrorResult(message) {
  return baseError.setMessage(message).setCode(ResultCode.AuthError).toBody();
}
function okResult(data) {
  return new OkResult(data).toBody();
}

// src/catch-middleware.ts
var catch_middleware_exports = {};
__export(catch_middleware_exports, {
  default: () => catch_middleware_default
});
var catch_middleware_default = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (Result.isResult(e)) {
      ctx.response.body = e;
      return;
    } else if (Result.isError(e)) {
      ctx.response.body = serverErrorResult(e.message);
      return;
    } else {
      ctx.response.body = serverErrorResult(String(e));
      return;
    }
  }
};
export {
  OkResult,
  Result,
  authErrorResult,
  catch_middleware_exports as catchMiddleware,
  okResult,
  paramErrorResult,
  serverErrorResult
};
