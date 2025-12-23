import { Context, Router } from "@oak/oak";
import { useValidate } from "@packages/hooks";
import type {
  IHubConnection,
  IHubConnectionLogger,
  IHubMessage,
} from "@packages/types";
import { KeepAlive } from "./keep-alive.ts";

const { isJson } = useValidate();

function isHubMessage(value: unknown): value is string {
  let data: Record<string, unknown>;
  if (isJson(value)) {
    data = JSON.parse(value as string);
  } else {
    return false;
  }
  if (
    !["keep-alive", "message", "json", "file", "method"].includes(
      data.type as string,
    )
  )
    return false;
  if (data.type === "message" && typeof data.message !== "string") return false;
  if (data.type === "json" && typeof data.json !== "object") return false;
  if (data.type === "binary" && !Array.isArray(data.file)) return false;
  if (data.type === "method" && typeof data.name !== "string") return false;
  return true;
}

export abstract class HubConnection implements IHubConnection {
  keepAliveInterval: number = 5000;

  keepAliveTimeouts: number[] = [10000, 15000, 20000];

  private keepAlive = new KeepAlive(
    this.keepAliveInterval,
    this.keepAliveTimeouts,
  );

  private id = crypto.randomUUID();

  private sockets = new Map<string, WebSocket>();

  logger: IHubConnectionLogger | null = null;

  constructor() {
    this.keepAlive.onSend(() => this.sendKeepAlive());
    this.keepAlive.onClose(() => this.onKeepAliveTimeout());
  }

  /**
   * 注入路由配置，将WebSocket连接的中间件注册到指定路径
   * @param router 路由器实例，用于注册HTTP路由
   * @param connect WebSocket连接实例，包含路径和中间件信息
   */
  static inject(router: Router, path: string, connect: () => HubConnection) {
    // 将WebSocket中间件注册到对应路由路径
    router.get(path, (ctx: Context) => {
      const data = connect();
      data.middleware(ctx);
    });
  }

  /**
   * WebSocket中间件函数，用于处理WebSocket连接的建立和事件监听
   * @param ctx - Koa上下文对象，包含HTTP请求相关信息
   */
  private middleware(ctx: Context) {
    // 检查当前连接是否支持升级到WebSocket协议
    if (!ctx.isUpgradable) return ctx.throw(501);

    // 将HTTP连接升级为WebSocket连接
    const ws = ctx.upgrade();

    // 将新建立的WebSocket连接存储到连接池中
    this.sockets.set(this.id, ws);

    // 为WebSocket连接注册各种事件监听器
    ws.addEventListener("message", (e: MessageEvent) => this.handleMessage(e));
    ws.addEventListener("open", (e: Event) => this.handleOpen(e));
    ws.addEventListener("close", (e: CloseEvent) => this.handleClose(e));
    ws.addEventListener("error", (e: Event) => this.handleError(e));
  }

  /**
   * 处理WebSocket接收到的消息事件
   * @param evt - WebSocket消息事件对象，包含接收到的数据
   */
  private handleMessage(evt: MessageEvent) {
    // 检查接收的数据是否为Hub消息格式
    if (!isHubMessage(evt.data)) return;
    const data: IHubMessage = JSON.parse(evt.data);
    // 根据消息类型进行不同的处理
    switch (data.type) {
      case "keep-alive":
        // 处理心跳保持连接消息
        this.keepAlive.receive();
        break;
      case "message":
        // 处理文本消息
        this.onMessage(data.message);
        break;
      case "json":
        // 处理JSON字符串消息
        this.onJson(data.json);
        break;
      case "binary":
        // 处理二进制文件消息
        this.onBinary(data.file);
        break;
      case "method":
        // 处理方法消息
        this.onMethod(data.name, data.options);
        break;
      default:
    }
  }

  /**
   * 处理连接打开事件
   * @param evt - 事件对象
   */
  private handleOpen(evt: Event) {
    // 连接日志记录器
    this.logger?.connect(this);
    // 启动心跳保活机制
    this.keepAlive.connect();
    // 调用打开连接回调函数
    this.onOpen(evt);
  }

  /**
   * 处理关闭事件的私有方法
   * @param evt - 关闭事件对象，包含关闭相关的信息
   */
  private handleClose(evt: CloseEvent) {
    if (evt.code === 1005) {
      // 正常关闭
      this.keepAlive.normalClose();
    }
    // 断开日志记录器的连接
    this.logger?.disconnect(this);
    // 调用关闭回调函数
    this.onClose(evt);
  }

  private handleError(evt: Event) {
    this.logger?.error(this, evt);
    this.onError(evt);
  }

  private sendKeepAlive() {
    const message: IHubMessage = { type: "keep-alive" };
    this.sockets.get(this.id)?.send(JSON.stringify(message));
  }

  /**
   * 获取当前实例的唯一标识符
   * @returns 返回实例的ID字符串
   */
  getId(): string {
    return this.id;
  }

  /**
   * 设置日志记录器
   * @param logger - 实现IHubConnectionLogger接口的日志记录器实例
   * @returns 返回当前对象实例，支持链式调用
   */
  withLogger(logger: IHubConnectionLogger) {
    this.logger = logger;
    return this;
  }

  /**
   * 设置保持连接间隔时间
   * @param interval 间隔时间（毫秒）
   * @returns 返回当前实例，支持链式调用
   */
  withKeepAliveInterval(interval: number) {
    this.keepAliveInterval = interval;
    this.keepAlive.interval = interval;
    return this;
  }

  /**
   * 设置保持连接超时时间数组
   * @param timeouts - 超时时间数组，用于配置保持连接的超时策略
   * @returns 返回当前实例，支持链式调用
   */
  withKeepAliveTimeouts(timeouts: number[]) {
    this.keepAliveTimeouts = timeouts;
    this.keepAlive.timeouts = timeouts;
    return this;
  }

  onOpen(event: Event) {
    console.log(this.getId(), "onOpen", event);
  }

  onClose(event: CloseEvent) {
    console.log(this.getId(), "onClose", event);
  }

  onError(event: Event) {
    console.log(this.getId(), "onError", event);
  }

  onMessage(message: string) {
    console.log(this.getId(), "onMessage", message);
  }

  onJson(json: object) {
    console.log(this.getId(), "onJson", json);
  }

  onBinary(data: Uint8Array) {
    console.log(this.getId(), "onBinary", data);
  }

  onMethod(name: string, options?: object) {
    console.log(this.getId(), "onMethod", name, options);
  }

  onKeepAliveTimeout() {
    this.logger?.timeout(this);
    this.close();
    this.keepAlive.clear();
  }

  sendTextMessage(message: string): void {
    const data: IHubMessage = {
      type: "message",
      message,
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }

  sendJsonMessage<T extends Record<string, unknown> = Record<string, unknown>>(
    message: T,
  ): void {
    const data: IHubMessage = {
      type: "json",
      json: message,
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }

  sendBinaryMessage(message: Uint8Array): void {
    const data: IHubMessage = {
      type: "binary",
      file: message,
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }

  sendMethodMessage(name: string, options?: object): void {
    const data: IHubMessage = {
      type: "method",
      name,
      options,
    };
    this.sockets.get(this.id)?.send(JSON.stringify(data));
  }

  close(): void {
    this.sockets.get(this.id)?.close();
    this.sockets.delete(this.id);
  }
}
