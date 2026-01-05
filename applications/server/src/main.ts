/**
 * 服务器应用主入口文件
 * 负责初始化应用、配置中间件、注册路由和启动服务
 */

// 导入 TypeORM 的反射元数据支持，用于实体类装饰器
import "reflect-metadata";

// 导入 Hono 框架核心组件
import { Hono } from "hono";
import { languageDetector } from "hono/language";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";

// 导入自定义中间件包
import {
  dataWrapper, // 数据包装器，统一响应格式
  autoRegisterController, // 自动注册控制器
  logger, // 日志中间件
  verifyValueFromKey,
  errorHandle, // 验证值从键中间件
} from "@packages/middlewares";

// 导入环境变量配置
import { env } from "~env";
import "~redis";

// 导入数据库连接和配置
import { connectDB } from "~data-source";

// 导入错误捕获处理器
import { AllowCatch } from "./allow-catch.ts";
import "@packages/encryption";
import { i18n } from "~locale";
import { connectInfo } from "./easy-middlewares.ts";
import { type ConnectInfoVar } from "@packages/types";
import { UserService } from "~services/user/UserService.ts";
import { Logger } from "~logger";

/**
 * 初始化数据库连接
 * 在应用启动前建立与数据库的连接
 */
await connectDB();

/**
 * 创建 Hono 应用实例
 * 使用泛型定义应用上下文变量类型
 */
const app = new Hono<{
  Variables: ConnectInfoVar;
}>();

/**
 * 配置跨域资源共享 (CORS)
 * 允许来自 localhost 所有端口的跨域请求
 */
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

/**
 * 添加上下文存储中间件
 * 用于在请求处理过程中存储和访问上下文变量
 */
app.use(contextStorage());

app.use(
  verifyValueFromKey({
    ignore: ["safety/code"],
  }),
);

/**
 * 添加连接信息中间件
 * 在每个请求中记录连接相关信息
 */
app.use(connectInfo());

/**
 * 添加日志中间件
 * 使用自定义的错误捕获处理器记录请求日志
 */
app.use(
  logger(new AllowCatch(), {
    ignore: [/\/log\/.*/],
  }),
);

/**
 * 添加数据包装器中间件
 * 统一 API 响应格式，处理成功和错误响应
 */
app.use(dataWrapper(Logger));

/**
 * 添加语言检测器中间件
 * 检测请求头中的语言偏好，支持英文和中文
 */
app.use(
  languageDetector({
    order: ["header", "querystring", "cookie"],
    supportedLanguages: ["en", "zh-CN"],
    fallbackLanguage: "en",
  }),
);

/**
 * 全局错误处理中间件
 * 捕获应用中所有未处理的异常
 *
 * @param err 捕获的错误对象
 * @param ctx Hono 上下文对象
 * @returns 统一的错误响应
 */
app.onError(errorHandle(() => i18n.t("token.invalid")));

/**
 * 自动注册控制器
 * 扫描并注册所有控制器路由
 */
autoRegisterController(app, Logger);

/**
 * 启动服务器
 * 在控制台输出启动信息并监听 8080 端口
 */
Logger.info("Server is running on host: http://localhost:8080");
Deno.serve({ port: env.PORT }, app.fetch);

UserService.init();
