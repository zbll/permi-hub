import { DataSource } from "typeorm";
import { createConnection } from "mysql2";
import { env } from "~env";
import { User } from "~entity/User.ts";
import { Log } from "~entity/Log.ts";
import { Role } from "~entity/Role.ts";
import { Permission } from "~entity/Permission.ts";
import { EmailCode } from "~entity/EmailCode.ts";
import { Logger } from "~logger";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [User, Log, Role, Permission, EmailCode],
  synchronize: env.DEVELOPMENT,
  logging: false, // env.DEVELOPMENT,
  driver: createConnection,
  connectorPackage: "mysql",
});

/**
 * 连接数据库
 */
export async function connectDB() {
  await AppDataSource.initialize();
  Logger.success("数据库连接成功");
}
