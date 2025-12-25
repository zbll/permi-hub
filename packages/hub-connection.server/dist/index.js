// src/hub-connection-logger.ts
var HubConnectionLogger = class {
  log(msg) {
    console.log(msg);
  }
  connect(connect) {
    this.log(`Websocket connected ID[${connect.getId()}]`);
  }
  disconnect(connect) {
    this.log(`Websocket disconnected ID[${connect.getId()}]`);
  }
  message(connect, data) {
    this.log(`Websocket message ID[${connect.getId()}]: ${data}`);
  }
  error(connect, error) {
    this.log(`Websocket error ID[${connect.getId()}]: ${error}`);
  }
  timeout(connect) {
    this.log(`Websocket timeout ID[${connect.getId()}]`);
  }
};

// ../hooks/dist/index.js
var Regexs = Object.freeze({
  /** HTTP URL验证正则表达式 */
  http: /^http:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/,
  /** HTTPS URL验证正则表达式 */
  https: /^https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/,
  /** 中文字符验证正则表达式 */
  chinese: /^[\u4e00-\u9fa5]+$/,
  /** 电子邮箱验证正则表达式 */
  email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  /** 通用互联网URL验证正则表达式 */
  internetUrl: /^[a-zA-Z]+:\/\/[^\s]+$/
});
function useValidate() {
  const getInstance = (value) => Object.prototype.toString.call(value);
  const isObject = (value) => getInstance(value) === "[object Object]";
  const isArray = (value) => Array.isArray(value);
  const isString = (value) => typeof value === "string";
  const isNumber = (value) => typeof value === "number";
  const isBoolean = (value) => typeof value === "boolean";
  const isDate = (value) => getInstance(value) === "[object Date]";
  const isJson2 = (value) => {
    if (isObject(value) || isArray(value) || isDate(value)) return true;
    if (!isString(value)) return false;
    try {
      JSON.parse(value);
      return true;
    } catch (_) {
      return false;
    }
  };
  const isUrl = (value, range) => {
    if (!range && (Regexs.http.test(value) || Regexs.https.test(value))) return true;
    if (range?.http && Regexs.http.test(value)) return true;
    if (range?.https && Regexs.https.test(value)) return true;
    return false;
  };
  const isChinese = (value) => Regexs.chinese.test(value);
  const isEmail = (value) => Regexs.email.test(value);
  const isInternetUrl = (value) => Regexs.internetUrl.test(value);
  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };
  return {
    getInstance,
    isObject,
    isArray,
    isString,
    isNumber,
    isBoolean,
    isDate,
    isJson: isJson2,
    isUrl,
    isChinese,
    isEmail,
    isInternetUrl,
    isValidDate,
    Regexs
  };
}

// src/keep-alive.ts
var KeepAlive = class {
  interval;
  timeouts;
  /** 心跳定时器ID */
  _timer;
  /** 重试索引，用于跟踪当前的重试次数 */
  _retryIndex;
  /** 发送心跳包的回调函数 */
  _send;
  /** 关闭连接的回调函数 */
  _close;
  /** 是否正常关闭连接的标志 */
  isNormalClose;
  /**
   * 构造函数
   *
   * @param {number} interval - 心跳间隔时间（毫秒）
   * @param {number[]} timeouts - 重试超时时间数组（毫秒）
   */
  constructor(interval, timeouts) {
    this.interval = interval;
    this.timeouts = timeouts;
    this._timer = 0;
    this._retryIndex = -1;
    this._send = null;
    this._close = null;
    this.isNormalClose = false;
    if (this.timeouts.length !== 0) {
      this._retryIndex = 0;
    }
  }
  /**
   * 开始心跳机制
   *
   * 如果间隔时间小于0，则不启动心跳
   */
  connect() {
    if (this.interval < 0) return;
    this.setTimeoutKeepAlive();
    this.isNormalClose = false;
  }
  /**
   * 标记连接为正常关闭
   *
   * 这会停止所有重试操作
   */
  normalClose() {
    this.isNormalClose = true;
  }
  /**
   * 设置发送心跳包的回调函数
   *
   * @param {() => void} send - 发送心跳包的回调函数
   */
  onSend(send) {
    this._send = send;
  }
  /**
   * 设置关闭连接的回调函数
   *
   * @param {() => void} close - 关闭连接的回调函数
   */
  onClose(close) {
    this._close = close;
  }
  /**
   * 设置心跳定时器
   *
   * 重置重试索引并设置定时发送心跳包
   */
  setTimeoutKeepAlive() {
    if (this.timeouts.length !== 0) {
      this._retryIndex = 0;
    }
    setTimeout(() => {
      this.sendKeepAlive();
    }, this.interval);
  }
  /**
   * 发送心跳包
   *
   * 调用发送回调函数并开始重试机制
   */
  sendKeepAlive() {
    this._send?.();
    this.retry();
  }
  /**
   * 重试机制
   *
   * 如果连接已正常关闭，则不进行重试
   * 如果没有设置重试超时数组，则在2秒后关闭连接
   * 否则按照超时数组进行重试，直到达到最大重试次数后关闭连接
   */
  retry() {
    if (this.isNormalClose) return;
    const index = this._retryIndex;
    if (index === -1) {
      this._timer = setTimeout(() => {
        this._close?.();
        clearTimeout(this._timer);
      }, 2e3);
      return;
    }
    const interval = this.timeouts[index];
    this._timer = setTimeout(() => {
      if (this._retryIndex === this.timeouts.length - 1) {
        clearTimeout(this._timer);
        this._close?.();
        return;
      }
      this._retryIndex += 1;
      this.sendKeepAlive();
    }, interval);
  }
  /**
   * 接收心跳响应
   *
   * 清除当前定时器并重新设置心跳定时器
   */
  receive() {
    if (this.interval < 0) return;
    clearTimeout(this._timer);
    this.setTimeoutKeepAlive();
  }
  /**
   * 销毁心跳实例
   *
   * 清除定时器并释放所有回调函数
   */
  destory() {
    this.clear();
    this._close = null;
    this._send = null;
  }
  /**
   * 清除当前定时器
   */
  clear() {
    clearTimeout(this._timer);
  }
};

// src/hub-connection.ts
var { isJson } = useValidate();
function isHubMessage(value) {
  let data;
  if (isJson(value)) {
    data = JSON.parse(value);
  } else {
    return false;
  }
  if (![
    "keep-alive",
    "message",
    "json",
    "file",
    "method"
  ].includes(data.type)) return false;
  if (data.type === "message" && typeof data.message !== "string") return false;
  if (data.type === "json" && typeof data.json !== "object") return false;
  if (data.type === "binary" && !Array.isArray(data.file)) return false;
  if (data.type === "method" && typeof data.name !== "string") return false;
  return true;
}
var HubConnection = class {
  keepAliveInterval = 5e3;
  keepAliveTimeouts = [
    1e4,
    15e3,
    2e4
  ];
  keepAlive = new KeepAlive(this.keepAliveInterval, this.keepAliveTimeouts);
  id = crypto.randomUUID();
  sockets = /* @__PURE__ */ new Map();
  logger = null;
  constructor() {
    this.keepAlive.onSend(() => this.sendKeepAlive());
    this.keepAlive.onClose(() => this.onKeepAliveTimeout());
  }
  /**
   * 注入路由配置，将WebSocket连接的中间件注册到指定路径
   * @param router 路由器实例，用于注册HTTP路由
   * @param connect WebSocket连接实例，包含路径和中间件信息
   */
  static inject(router, path, connect) {
    router.get(path, (ctx) => {
      const data = connect();
      data.middleware(ctx);
    });
  }
  /**
   * WebSocket中间件函数，用于处理WebSocket连接的建立和事件监听
   * @param ctx - Koa上下文对象，包含HTTP请求相关信息
   */
  middleware(ctx) {
    if (!ctx.isUpgradable) return ctx.throw(501);
    const ws = ctx.upgrade();
    this.sockets.set(this.id, ws);
    ws.addEventListener("message", (e) => this.handleMessage(e));
    ws.addEventListener("open", (e) => this.handleOpen(e));
    ws.addEventListener("close", (e) => this.handleClose(e));
    ws.addEventListener("error", (e) => this.handleError(e));
  }
  /**
   * 处理WebSocket接收到的消息事件
   * @param evt - WebSocket消息事件对象，包含接收到的数据
   */
  handleMessage(evt) {
    if (!isHubMessage(evt.data)) return;
    const data = JSON.parse(evt.data);
    switch (data.type) {
      case "keep-alive":
        this.keepAlive.receive();
        break;
      case "message":
        this.onMessage(data.message);
        break;
      case "json":
        this.onJson(data.json);
        break;
      case "binary":
        this.onBinary(data.file);
        break;
      case "method":
        this.onMethod(data.name, data.options);
        break;
      default:
    }
  }
  /**
   * 处理连接打开事件
   * @param evt - 事件对象
   */
  handleOpen(evt) {
    this.logger?.connect(this);
    this.keepAlive.connect();
    this.onOpen(evt);
  }
  /**
   * 处理关闭事件的私有方法
   * @param evt - 关闭事件对象，包含关闭相关的信息
   */
  handleClose(evt) {
    if (evt.code === 1005) {
      this.keepAlive.normalClose();
    }
    this.logger?.disconnect(this);
    this.onClose(evt);
  }
  handleError(evt) {
    this.logger?.error(this, evt);
    this.onError(evt);
  }
  sendKeepAlive() {
    const message = {
      type: "keep-alive"
    };
    this.sockets.get(this.id)?.send(JSON.stringify(message));
  }
  /**
   * 获取当前实例的唯一标识符
   * @returns 返回实例的ID字符串
   */
  getId() {
    return this.id;
  }
  /**
   * 设置日志记录器
   * @param logger - 实现IHubConnectionLogger接口的日志记录器实例
   * @returns 返回当前对象实例，支持链式调用
   */
  withLogger(logger) {
    this.logger = logger;
    return this;
  }
  /**
   * 设置保持连接间隔时间
   * @param interval 间隔时间（毫秒）
   * @returns 返回当前实例，支持链式调用
   */
  withKeepAliveInterval(interval) {
    this.keepAliveInterval = interval;
    this.keepAlive.interval = interval;
    return this;
  }
  /**
   * 设置保持连接超时时间数组
   * @param timeouts - 超时时间数组，用于配置保持连接的超时策略
   * @returns 返回当前实例，支持链式调用
   */
  withKeepAliveTimeouts(timeouts) {
    this.keepAliveTimeouts = timeouts;
    this.keepAlive.timeouts = timeouts;
    return this;
  }
  onOpen(event) {
    console.log(this.getId(), "onOpen", event);
  }
  onClose(event) {
    console.log(this.getId(), "onClose", event);
  }
  onError(event) {
    console.log(this.getId(), "onError", event);
  }
  onMessage(message) {
    console.log(this.getId(), "onMessage", message);
  }
  onJson(json) {
    console.log(this.getId(), "onJson", json);
  }
  onBinary(data) {
    console.log(this.getId(), "onBinary", data);
  }
  onMethod(name, options) {
    console.log(this.getId(), "onMethod", name, options);
  }
  onKeepAliveTimeout() {
    this.logger?.timeout(this);
    this.close();
    this.keepAlive.clear();
  }
  sendTextMessage(message) {
    const data = {
      type: "message",
      message
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }
  sendJsonMessage(message) {
    const data = {
      type: "json",
      json: message
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }
  sendBinaryMessage(message) {
    const data = {
      type: "binary",
      file: message
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }
  sendMethodMessage(name, options) {
    const data = {
      type: "method",
      name,
      options
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }
  close() {
    this.sockets.get(this.id)?.close();
    this.sockets.delete(this.id);
  }
};
export {
  HubConnection,
  HubConnectionLogger
};
