/**
 * 心跳保持类
 *
 * 用于管理连接的心跳机制，确保连接的活跃性。支持定时发送心跳包和重试机制。
 */
export class KeepAlive {
  /** 心跳定时器ID */
  private _timer: number = 0;

  /** 重试索引，用于跟踪当前的重试次数 */
  private _retryIndex: number = -1;

  /** 发送心跳包的回调函数 */
  private _send: (() => void) | null = null;

  /** 关闭连接的回调函数 */
  private _close: (() => void) | null = null;

  /** 是否正常关闭连接的标志 */
  private isNormalClose = false;

  /**
   * 构造函数
   *
   * @param {number} interval - 心跳间隔时间（毫秒）
   * @param {number[]} timeouts - 重试超时时间数组（毫秒）
   */
  constructor(
    public interval: number,
    public timeouts: number[],
  ) {
    if (this.timeouts.length !== 0) {
      this._retryIndex = 0;
    }
  }

  /**
   * 开始心跳机制
   *
   * 如果间隔时间小于0，则不启动心跳
   */
  connect(): void {
    if (this.interval < 0) return;
    this.setTimeoutKeepAlive();
    this.isNormalClose = false;
  }

  /**
   * 标记连接为正常关闭
   *
   * 这会停止所有重试操作
   */
  normalClose(): void {
    this.isNormalClose = true;
  }

  /**
   * 设置发送心跳包的回调函数
   *
   * @param {() => void} send - 发送心跳包的回调函数
   */
  onSend(send: () => void): void {
    this._send = send;
  }

  /**
   * 设置关闭连接的回调函数
   *
   * @param {() => void} close - 关闭连接的回调函数
   */
  onClose(close: () => void): void {
    this._close = close;
  }

  /**
   * 设置心跳定时器
   *
   * 重置重试索引并设置定时发送心跳包
   */
  private setTimeoutKeepAlive() {
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
  private sendKeepAlive() {
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
  private retry() {
    if (this.isNormalClose) return;
    const index = this._retryIndex;
    if (index === -1) {
      this._timer = setTimeout(() => {
        this._close?.();
        clearTimeout(this._timer);
      }, 2000);
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
}
