/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
export default class Console {
  private static slog(style: string, ...message: any[]) {
    console.log(`%c${message.join(" ")}`, style);
  }
  private static serr(style: string, ...message: any[]) {
    console.error(`%c${message.join(" ")}`, style);
  }
  private static swarn(style: string, ...message: any[]) {
    console.warn(`%c${message.join(" ")}`, style);
  }

  static danger(...message: any[]) {
    this.serr("color: red;", ...message);
  }

  static warn(...message: any[]) {
    this.swarn("color: yellow;", ...message);
  }

  static success(...message: any[]) {
    this.slog("color: green;", ...message);
  }

  static info(...message: any[]) {
    this.slog("color: gray;", ...message);
  }
}
