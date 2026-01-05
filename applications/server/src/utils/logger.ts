import { env } from "~env";
import { createLogger, type LoggerImpl } from "@packages/console";
export const Logger: LoggerImpl = createLogger(!env.DEVELOPMENT);
