import { createClient } from "redis";
import Console from "@packages/console";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  Console.danger("Redis错误", error);
});
await redisClient.connect();
Console.success("Redis已连接");

export { redisClient };
