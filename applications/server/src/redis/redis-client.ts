import { createClient } from "redis";
import { Logger } from "~logger";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  Logger.danger("Redis错误", error);
});
await redisClient.connect();
Logger.success("Redis已连接");

export { redisClient };
