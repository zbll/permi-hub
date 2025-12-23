/**
 * Hub消息类型定义
 *
 * 表示Hub连接中可能传输的不同类型的消息
 */
export type IHubMessage =
  /** 心跳消息，用于保持连接活跃 */
  | { type: "keep-alive" }
  /** 文本消息 */
  | { type: "message"; message: string }
  /** JSON消息 */
  | { type: "json"; json: Record<string, any> }
  /** 二进制文件消息 */
  | { type: "binary"; file: Uint8Array }
  /** 方法调用消息 */
  | { type: "method"; name: string; options?: any };

/**
 * Hub连接接口
 *
 * 定义了Hub连接的属性和方法，用于管理和通信
 */
export interface IHubConnection {
  /** 心跳间隔时间（毫秒） */
  keepAliveInterval: number;
  /** 日志记录器实例，可为null */
  logger: IHubConnectionLogger | null;

  /**
   * 获取连接ID
   *
   * @returns {string} - 连接的唯一标识符
   */
  getId(): string;

  /**
   * 当连接打开时调用
   *
   * @param {Event} event - 连接打开事件
   */
  onOpen(event: Event): void;

  /**
   * 当连接关闭时调用
   *
   * @param {CloseEvent} event - 连接关闭事件
   */
  onClose(event: CloseEvent): void;

  /**
   * 当连接发生错误时调用
   *
   * @param {Event} event - 错误事件
   */
  onError(event: Event): void;

  /**
   * 当收到文本消息时调用
   *
   * @param {string} message - 收到的文本消息
   */
  onMessage(message: string): void;

  /**
   * 当收到JSON消息时调用
   *
   * @param {object} json - 收到的JSON对象
   */
  onJson(json: object): void;

  /**
   * 当收到二进制数据时调用
   *
   * @param {Uint8Array} data - 收到的二进制数据
   */
  onBinary(data: Uint8Array): void;

  /**
   * 当收到方法调用消息时调用
   *
   * @param {string} name - 方法名称
   * @param {object} [options] - 方法调用参数
   */
  onMethod(name: string, options?: object): void;

  /**
   * 当心跳超时未收到响应时调用
   */
  onKeepAliveTimeout(): void;

  /**
   * 发送文本消息
   *
   * @param {string} message - 要发送的文本消息
   */
  sendTextMessage(message: string): void;

  /**
   * 发送JSON消息
   *
   * @template T - JSON消息的类型
   * @param {T} message - 要发送的JSON对象
   */
  sendJsonMessage<T extends Record<string, any> = Record<string, any>>(
    message: T,
  ): void;

  /**
   * 发送二进制消息
   *
   * @param {Uint8Array} message - 要发送的二进制数据
   */
  sendBinaryMessage(message: Uint8Array): void;

  /**
   * 发送方法调用消息
   *
   * @param {string} name - 方法名称
   * @param {object} [options] - 方法调用参数
   */
  sendMethodMessage(name: string, options?: object): void;

  /**
   * 关闭连接
   */
  close(): void;
}

/**
 * Hub连接日志记录器接口
 *
 * 定义了用于记录Hub连接事件的方法
 */
export interface IHubConnectionLogger {
  /**
   * 当连接建立时记录
   *
   * @param {IHubConnection} connect - 连接实例
   */
  connect(connect: IHubConnection): void;

  /**
   * 当连接断开时记录
   *
   * @param {IHubConnection} connect - 连接实例
   */
  disconnect(connect: IHubConnection): void;

  /**
   * 当收到消息时记录
   *
   * @param {IHubConnection} connect - 连接实例
   * @param {IHubMessage} data - 收到的消息
   */
  message(connect: IHubConnection, data: IHubMessage): void;

  /**
   * 当连接发生错误时记录
   *
   * @template T - 错误事件的类型
   * @param {IHubConnection} connect - 连接实例
   * @param {T} error - 错误事件
   */
  error<T extends Event = Event>(connect: IHubConnection, error: T): void;

  /**
   * 当连接超时时记录
   *
   * @param {IHubConnection} connect - 连接实例
   */
  timeout(connect: IHubConnection): void;
}
