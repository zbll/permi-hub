import { Hono } from "hono";
import { publicKey } from "@packages/encryption";

const router = new Hono();

router.get("/code", (ctx) => {
  return ctx.json(publicKey);
});

export default router;
