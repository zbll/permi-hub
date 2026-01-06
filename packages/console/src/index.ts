import winston, { type LeveledLogMethod, type QueryOptions } from "winston";
import "winston-daily-rotate-file";

export const LoggerLevels = {
  levels: {
    danger: 0,
    warn: 1,
    success: 2,
    info: 3,
  },
  colors: {
    danger: "red",
    warn: "yellow",
    success: "green",
    info: "blue",
  },
};

export type LoggerImpl = {
  danger: LeveledLogMethod;
  warn: LeveledLogMethod;
  success: LeveledLogMethod;
  info: LeveledLogMethod;
  query: (
    options?: QueryOptions,
    // deno-lint-ignore no-explicit-any
    callback?: (err: Error, results: any) => void,
  ) => unknown;
};

export function createLogger(product = true): LoggerImpl {
  const logger = winston.createLogger({
    levels: LoggerLevels.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: "error",
        dirname: "logs",
        filename: "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "5m",
        json: true,
      }),
      new winston.transports.DailyRotateFile({
        dirname: "logs",
        filename: "combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "5m",
        json: true,
      }),
    ],
  });
  winston.addColors(LoggerLevels.colors);
  if (product) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }
  return logger as unknown as LoggerImpl;
}
