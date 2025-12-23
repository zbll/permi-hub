// src/index.ts
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
export {
  Console as default
};
