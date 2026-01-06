import type { BuilderOptions } from "~/components/shared/form-builder/brand-form-builder";
import { Locale } from "~/locale/declaration";
import { MailService } from "~/api/mail-service/mail-service.api";
import { toast } from "sonner";

export type UserBuilderOptionsProps = {
  nickname?: string;
  email?: string;
  password?: string;
};

export function createUserBuilderOptions(
  t: (key: string) => string,
  options?: UserBuilderOptionsProps,
): BuilderOptions {
  return {
    nickname: {
      type: "text",
      required: true,
      defaultValue: options?.nickname ?? "",
      error: () => t(Locale.User$Add$Form$Nickname$Empty),
      label: () => t(Locale.User$Add$Form$Nickname),
    },
    email: {
      type: "email",
      required: true,
      defaultValue: options?.email ?? "",
      autoComplete: "email",
      error: () => t(Locale.User$Add$Form$Email$Empty),
      label: () => t(Locale.User$Add$Form$Email),
    },
    emailCode: {
      type: "code",
      required: true,
      defaultValue: "",
      length: {
        value: 6,
        error: () => t(Locale.User$Add$Form$EmailCode$Empty),
      },
      action: {
        text: "发送验证码",
        onClick: async (formValues) => {
          if (!formValues.email) {
            toast.error(t(Locale.User$Add$Form$Email$Empty), {
              position: "top-center",
            });
            throw new Error("邮箱地址不能为空");
          }
          try {
            await MailService.sendCode(formValues.email);
          } catch (error) {
            console.error("发送验证码失败:", error);
            throw error;
          }
        },
        countdown: 60,
      },
      getEmail: (form) => form.getFieldValue("email") as string,
      error: () => t(Locale.User$Add$Form$EmailCode$Empty),
      label: () => t(Locale.User$Add$Form$EmailCode),
    },
    password: {
      type: "password",
      required: true,
      isNewPassword: true,
      defaultValue: options?.password ?? "",
      error: () => t(Locale.User$Add$Form$Password$Empty),
      label: () => t(Locale.User$Add$Form$Password),
    },
    confirmPassword: {
      type: "password",
      required: true,
      isNewPassword: true,
      defaultValue: options?.password ?? "",
      error: () => t(Locale.User$Add$Form$ConfirmPassword$Empty),
      label: () => t(Locale.User$Add$Form$ConfirmPassword),
    },
    submit: {
      type: "submit",
      text: () => t(Locale.Text$Confirm),
      cancel: {
        text: () => t(Locale.Text$Cancel),
      },
    },
  };
}
