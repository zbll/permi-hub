import type {
  IHubConnection,
  IHubConnectionLogger,
  IHubMessage,
} from "@packages/types";

/**
 * 日志记录器
 */
export class HubConnectionLogger implements IHubConnectionLogger {
  private log(msg: string) {
    console.log(msg);
  }

  connect(connect: IHubConnection): void {
    this.log(`Websocket connected ID[${connect.getId()}]`);
  }

  disconnect(connect: IHubConnection): void {
    this.log(`Websocket disconnected ID[${connect.getId()}]`);
  }

  message(connect: IHubConnection, data: IHubMessage): void {
    this.log(`Websocket message ID[${connect.getId()}]: ${data}`);
  }

  error<T extends Event = Event>(connect: IHubConnection, error: T): void {
    this.log(`Websocket error ID[${connect.getId()}]: ${error}`);
  }

  timeout(connect: IHubConnection): void {
    this.log(`Websocket timeout ID[${connect.getId()}]`);
  }
}
