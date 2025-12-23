import { Router } from "@oak/oak";
import type { IHubConnection, IHubConnectionLogger } from "@packages/types";
export declare abstract class HubConnection implements IHubConnection {
    keepAliveInterval: number;
    keepAliveTimeouts: number[];
    private keepAlive;
    private id;
    private sockets;
    logger: IHubConnectionLogger | null;
    constructor();
    /**
     * 注入路由配置，将WebSocket连接的中间件注册到指定路径
     * @param router 路由器实例，用于注册HTTP路由
     * @param connect WebSocket连接实例，包含路径和中间件信息
     */
    static inject(router: Router, path: string, connect: () => HubConnection): void;
    /**
     * WebSocket中间件函数，用于处理WebSocket连接的建立和事件监听
     * @param ctx - Koa上下文对象，包含HTTP请求相关信息
     */
    private middleware;
    /**
     * 处理WebSocket接收到的消息事件
     * @param evt - WebSocket消息事件对象，包含接收到的数据
     */
    private handleMessage;
    /**
     * 处理连接打开事件
     * @param evt - 事件对象
     */
    private handleOpen;
    /**
     * 处理关闭事件的私有方法
     * @param evt - 关闭事件对象，包含关闭相关的信息
     */
    private handleClose;
    private handleError;
    private sendKeepAlive;
    /**
     * 获取当前实例的唯一标识符
     * @returns 返回实例的ID字符串
     */
    getId(): string;
    /**
     * 设置日志记录器
     * @param logger - 实现IHubConnectionLogger接口的日志记录器实例
     * @returns 返回当前对象实例，支持链式调用
     */
    withLogger(logger: IHubConnectionLogger): this;
    /**
     * 设置保持连接间隔时间
     * @param interval 间隔时间（毫秒）
     * @returns 返回当前实例，支持链式调用
     */
    withKeepAliveInterval(interval: number): this;
    /**
     * 设置保持连接超时时间数组
     * @param timeouts - 超时时间数组，用于配置保持连接的超时策略
     * @returns 返回当前实例，支持链式调用
     */
    withKeepAliveTimeouts(timeouts: number[]): this;
    onOpen(event: Event): void;
    onClose(event: CloseEvent): void;
    onError(event: Event): void;
    onMessage(message: string): void;
    onJson(json: object): void;
    onBinary(data: Uint8Array): void;
    onMethod(name: string, options?: object): void;
    onKeepAliveTimeout(): void;
    sendTextMessage(message: string): void;
    sendJsonMessage<T extends Record<string, unknown> = Record<string, unknown>>(message: T): void;
    sendBinaryMessage(message: Uint8Array): void;
    sendMethodMessage(name: string, options?: object): void;
    close(): void;
}
