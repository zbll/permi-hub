import type { BuilderOptions } from "~/components/shared/form-builder/brand-form-builder";
import { Locale } from "~/locale/declaration";

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
      action: {
        text: "发送验证码",
        onClick: () => {
          // 测试方法：模拟发送验证码
          return new Promise((resolve) => {
            console.log("验证码已发送");
            setTimeout(resolve, 1000);
          });
        },
        countdown: 5,
      },
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
