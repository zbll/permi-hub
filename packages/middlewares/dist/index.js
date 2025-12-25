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
var Result = class _Result extends Error {
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
   * 生成详细的错误原因字符串
   *
   * 该方法将结果对象的详细信息格式化为可读的字符串，包含：
   * - 错误代码 (Code)
   * - HTTP 状态码 (StatusCode)
   * - 错误消息 (Message)
   * - 响应数据 (Data)
   * - 调用堆栈 (Stack)
   *
   * 主要用于调试和日志记录，便于开发人员快速定位问题
   *
   * @returns {string} 格式化的错误原因字符串
   *
   * @example
   * ```typescript
   * const result = new Result();
   * result.code = ResultCode.ServerError;
   * result.message = "数据库连接失败";
   * result.data = { host: "localhost", port: 3306 };
   *
   * console.log(result.toReason());
   * // 输出:
   * // Code: server_error,
   * // StatusCode: 500,
   * // Message: 数据库连接失败,
   * // Data: {"host":"localhost","port":3306}
   * // Stack: Error: 数据库连接失败
   * //     at ...
   * ```
   */
  toReason() {
    return `Code: ${this.code},
StatusCode: ${this.statusCode},
Message: ${this.message},
Data: ${JSON.stringify(this.data)}
Stack: ${this.stack}`;
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
  static from(data) {
    const result = new _Result();
    result.code = data.code;
    result.message = data.message;
    result.data = data.data;
    return result;
  }
  static fromError(err) {
    const result = new _Result();
    result.code = ResultCode.ServerError;
    result.message = err.message;
    result.data = null;
    result.stack = err.stack;
    return result;
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

// ../console/dist/index.js
var Console = class {
  static slog(style, ...message) {
    console.log(`%c${message.join(" ")}`, style);
  }
  static serr(style, ...message) {
    console.error(`%c${message.join(" ")}`, style);
  }
  static swarn(style, ...message) {
    console.warn(`%c${message.join(" ")}`, style);
  }
  static danger(...message) {
    this.serr("color: red;", ...message);
  }
  static warn(...message) {
    this.swarn("color: yellow;", ...message);
  }
  static success(...message) {
    this.slog("color: green;", ...message);
  }
  static info(...message) {
    this.slog("color: gray;", ...message);
  }
};

// src/auto-register-controller.ts
async function autoRegisterController(app, options) {
  const controllerDir = Deno.cwd() + (options?.controllerDir ?? "/src/controllers");
  const controllers = Deno.readDir(controllerDir);
  for await (const controller of controllers) {
    const routerPath = `${controllerDir}/${controller.name}/index.ts`;
    const module = await import(routerPath);
    if (!module.default) throw new Error(`\u8DEF\u7531\u6A21\u5757 ${routerPath} \u6CA1\u6709\u9ED8\u8BA4\u5BFC\u51FA`);
    if (typeof module.default.prefix !== "function" || typeof module.default.routes !== "function" || typeof module.default.allowedMethods !== "function" || typeof module.default.use !== "function") throw new Error(`\u8DEF\u7531\u6A21\u5757 ${routerPath} \u9ED8\u8BA4\u5BFC\u51FA\u4E0D\u662F Router \u5B9E\u4F8B`);
    const router = module.default;
    options?.routerUse?.(router);
    app.use(router.prefix("/" + controller.name).routes());
    app.use(router.allowedMethods());
    Console.success(`\u5DF2\u6CE8\u518C\u8DEF\u7531 ${controller.name}`);
  }
}

// src/data-wrapper.ts
function isPass(options, pathname) {
  if (!options?.ignore) return false;
  return options.ignore.some((item) => {
    if (item instanceof RegExp) return item.test(pathname);
    return pathname === item;
  });
}
var dataWrapper = (logger, options) => async (ctx, next) => {
  const passLog = isPass(options, ctx.request.url.pathname);
  try {
    await next();
    const data = ctx.response.body;
    ctx.response.body = okResult(data);
    if (!passLog) logger?.onSuccess?.(ctx.response.body, ctx);
  } catch (e) {
    if (!passLog) logger?.onCatch?.(e, ctx);
    if (Result.isError(e)) {
      const body = Result.fromError(e).toBody();
      ctx.response.body = body;
    } else {
      ctx.response.body = serverErrorResult(String(e));
    }
  }
};
export {
  OkResult,
  Result,
  authErrorResult,
  autoRegisterController,
  dataWrapper,
  okResult,
  paramErrorResult,
  serverErrorResult
};
