import type { LoggerImpl } from "@packages/console";
import type { Hono } from "hono";

export type AutoRegisterOptions = {
  controllerDir?: string;
  routerUse?: (router: unknown) => void;
};

export async function autoRegisterController(
  app: Hono | unknown,
  logger: LoggerImpl,
  options?: AutoRegisterOptions,
) {
  const controllerDir =
    Deno.cwd() + (options?.controllerDir ?? "/src/controllers");
  const controllers = Deno.readDir(controllerDir);
  for await (const controller of controllers) {
    const routerPath = `${controllerDir}/${controller.name}/index.ts`;
    const module = await import(routerPath);
    if (!module.default) throw new Error(`路由模块 ${routerPath} 没有默认导出`);
    if (
      !Array.isArray(module.default.routes) ||
      typeof module.default._basePath !== "string"
    )
      throw new Error(`路由模块 ${routerPath} 默认导出不是 Hono 实例`);
    const router = module.default;
    options?.routerUse?.(router);
    (app as Hono).route(`/${controller.name}`, router);
    logger.success(`已注册路由 ${controller.name}`);
  }
}
