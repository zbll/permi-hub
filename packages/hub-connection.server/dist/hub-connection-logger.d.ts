import type { IHubConnection, IHubConnectionLogger, IHubMessage } from "@packages/types";
/**
 * 日志记录器
 */
export declare class HubConnectionLogger implements IHubConnectionLogger {
    private log;
    connect(connect: IHubConnection): void;
    disconnect(connect: IHubConnection): void;
    message(connect: IHubConnection, data: IHubMessage): void;
    error<T extends Event = Event>(connect: IHubConnection, error: T): void;
    timeout(connect: IHubConnection): void;
}
