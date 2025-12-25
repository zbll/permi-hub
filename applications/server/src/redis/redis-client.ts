import { createClient } from "redis";
import Console from "@packages/console";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

await redisClient.connect();
Console.success("Redis已连接");

export { redisClient };
