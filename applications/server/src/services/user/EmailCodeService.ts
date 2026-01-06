import { AppDataSource } from "~data-source";
import { EmailCode, EmailCodeStatus } from "~entity/EmailCode.ts";
import { SendBuilder, SendMailSubjectBuilder } from "~/utils/mail.ts";
import { env } from "~env";
import { Logger } from "~logger";
import { i18n } from "~locale";
import { usePatience } from "@packages/hooks";
import { RequestError } from "@packages/types";

const emailCodeRepository = AppDataSource.getRepository(EmailCode);

/**
 * 邮箱验证码服务
 */
export class EmailCodeService {
  /**
   * 生成随机验证码
   * @param length 验证码长度
   * @returns 验证码
   */
  private static generateCode(length: number = 6): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length)
      .toUpperCase();
  }

  /**
   * 检查是否可以发送验证码
   * @param email 邮箱
   * @param sendIntervalSeconds 发送间隔（秒）
   * @returns 是否可以发送
   */
  static async canSend(
    email: string,
    sendIntervalSeconds: number = 60,
  ): Promise<boolean> {
    const [success, recentCode] = await usePatience(
      emailCodeRepository.findOne({
        where: { email },
        order: { createAt: "DESC" },
      }),
    );

    if (!success || !recentCode) return true;

    const timeDiff = (Date.now() - recentCode.createAt.getTime()) / 1000;
    const canSend = timeDiff >= sendIntervalSeconds;

    if (!canSend) {
      Logger.warn(
        `邮箱 ${email} 发送过于频繁，剩余时间：${Math.ceil(sendIntervalSeconds - timeDiff)}秒`,
      );
    }

    return canSend;
  }

  /**
   * 构建邮件主题
   * @param email 邮箱
   * @param code 验证码
   * @returns 邮件主题
   */
  private static async buildMailSubject(email: string, code: string) {
    try {
      const url = new URL(
        "../../templates/mail-template-code.html",
        import.meta.url,
      );
      const builder = await new SendMailSubjectBuilder()
        .from(env.MAILER_BASE_USERNAME)
        .to(email)
        .subject(i18n.t("mail.code.subject"))
        .loadHtmlTemplate(url);
      return builder
        .htmlTitle(i18n.t("template.mail.code.title"))
        .htmlCode(code)
        .build();
    } catch (e) {
      Logger.warn(`模板加载失败，使用纯文本发送`, e);
      return new SendMailSubjectBuilder()
        .from(env.MAILER_BASE_USERNAME)
        .to(email)
        .subject(i18n.t("mail.code.subject"))
        .content(i18n.t("mail.code.content", { code }))
        .html(`<p>${i18n.t("mail.code.content", { code })}</p>`)
        .build();
    }
  }

  /**
   * 发送验证码
   * @param email 邮箱
   * @param options 发送选项
   * @returns [success, data, error] 发送结果
   */
  static async send(
    email: string,
    options: {
      codeLength?: number;
      expireMinutes?: number;
      sendIntervalSeconds?: number;
    } = {},
  ) {
    // 简化参数处理
    const codeLength = options.codeLength || 6;
    const expireMinutes = options.expireMinutes || 10;
    const sendIntervalSeconds = options.sendIntervalSeconds || 60;

    // 1. 参数验证
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new RequestError(i18n.t("user.register.mail.invalid"));
    }

    // 2. 检查发送频率
    if (!(await this.canSend(email, sendIntervalSeconds))) {
      throw new RequestError(i18n.t("user.register.mail.send.frequent"));
    }

    // 3. 生成验证码
    const code = this.generateCode(codeLength);
    const expireAt = new Date(Date.now() + expireMinutes * 60 * 1000);

    let emailCode: EmailCode | null = null;

    try {
      // 4. 保存验证码
      await emailCodeRepository.delete({ email }); // 删除旧验证码
      const mail = new EmailCode();
      mail.email = email;
      mail.code = code;
      mail.expireAt = expireAt;
      mail.status = EmailCodeStatus.Pending;
      emailCode = await emailCodeRepository.save(mail);
      Logger.info(`验证码已生成：${email} -> ${code}`);

      // 5. 发送邮件
      const subject = await this.buildMailSubject(email, code);
      const mailer = new SendBuilder().loadClientFromEnv(env).build();
      const [sendSuccess, info] = await usePatience(mailer.send(subject));

      // 6. 更新状态并返回结果
      if (sendSuccess && info) {
        await emailCodeRepository.update(emailCode.id, {
          status: EmailCodeStatus.Sent,
        });
        Logger.success(`验证码已发送：${email} (${info.messageId})`);
        return emailCode;
      }

      // 发送失败
      Logger.danger(`验证码发送失败：${email}`);
      await emailCodeRepository.update(emailCode.id, {
        status: EmailCodeStatus.Failed,
      });
      throw new RequestError(i18n.t("user.register.mail.send.failed"));
    } catch (error) {
      // 处理异常
      if (emailCode) {
        await emailCodeRepository.update(emailCode.id, {
          status: EmailCodeStatus.Failed,
        });
      }
      Logger.danger(`发送验证码出错：${error}`);
      throw error instanceof RequestError
        ? error
        : new RequestError(i18n.t("user.register.mail.send.failed"));
    }
  }

  /**
   * 验证验证码
   * @param email 邮箱
   * @param code 验证码
   * @returns [success, data, error] 验证结果
   */
  static async verify(email: string, code: string) {
    // 1. 查找验证码
    const [findSuccess, emailCode] = await usePatience(
      emailCodeRepository.findOne({
        where: { email },
        order: { createAt: "DESC" },
      }),
    );

    // 2. 检查验证码是否存在
    if (!findSuccess || !emailCode) {
      Logger.warn(`验证码不存在：${email}`);
      throw new RequestError(i18n.t("user.register.code.not.found"));
    }

    // 3. 检查验证码是否正确
    if (emailCode.code !== code) {
      Logger.warn(`验证码错误：${email} -> ${code}`);
      throw new RequestError(i18n.t("user.register.code.invalid"));
    }

    // 4. 检查验证码是否过期
    if (new Date() > emailCode.expireAt) {
      Logger.warn(`验证码已过期：${email}`);
      throw new RequestError(i18n.t("user.register.code.expired"));
    }

    // 5. 验证成功，删除验证码
    await emailCodeRepository.delete(emailCode.id);
    Logger.success(`验证码验证成功：${email}`);
    return emailCode;
  }
}
