import { DataSource } from "typeorm";
import { createConnection } from "mysql2";
import { env } from "../load-env.ts";
import { User } from "./entity/User.ts";
import Console from "@packages/console";

const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [User],
  synchronize: env.DEVELOPMENT,
  logging: env.DEVELOPMENT,
  driver: createConnection,
});

/**
 * 连接数据库
 */
export async function connectDB() {
  await AppDataSource.initialize();
  Console.success("数据库连接成功");
}
