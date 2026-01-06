import { Hono } from "hono";
import { validator } from "hono/validator";
import { usePatience, useRequestValidator } from "@packages/hooks";
import { validatorOptions, i18n } from "~locale";
import { EmailCodeService } from "~services/user/EmailCodeService.ts";
import { ServerError } from "@packages/types";

const router = new Hono();

/**
 * 根据邮箱发送验证码接口
 * POST /mail/send-code
 * @param email 邮箱地址
 * @returns 发送结果
 */
router.post(
  "/send-code",
  validator("json", (value) => {
    const { required } = useRequestValidator(value, validatorOptions);
    const email = required("email").email().string().toValue<string>();
    return { email };
  }),
  async (ctx) => {
    const { email } = ctx.req.valid("json");

    // 调用 EmailCodeService 发送验证码
    const [success, code] = await usePatience(EmailCodeService.send(email));

    if (!success) throw new ServerError(i18n.t("mail.sendCode.failed"));

    return ctx.json({ expireAt: code.expireAt });
  },
);

export default router;
