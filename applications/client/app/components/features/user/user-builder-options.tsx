import type {
  BuilderField,
  BuilderOptions,
} from "~/components/shared/form-builder/brand-form-builder";
import { Locale } from "~/locale/declaration";
import { MailService } from "~/api/mail-service/mail-service.api";
import { toast } from "sonner";
import type { UserAddApi } from "@packages/types";
import type { SelectFormOption } from "~/components/shared/form-builder/select-from-builder";

export type UserBuilderOptionsProps = {
  nickname?: string;
  email?: string;
  password?: string;
  roles?: SelectFormOption[];
  roleOptions: SelectFormOption[];
};

export function createUserBuilderOptions(
  t: (key: string) => string,
  options?: UserBuilderOptionsProps,
): BuilderOptions<UserAddApi> & { submit: BuilderField } {
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
      defaultValue: options?.password ?? "",
      error: () => t(Locale.User$Add$Form$Password$Empty),
      label: () => t(Locale.User$Add$Form$Password),
    },
    confirmPassword: {
      type: "password",
      required: true,
      defaultValue: options?.password ?? "",
      isNewPassword: true,
      error: () => t(Locale.User$Add$Form$ConfirmPassword$Empty),
      label: () => t(Locale.User$Add$Form$ConfirmPassword),
    },
    roles: {
      type: "select",
      defaultValue: options?.roles ?? [],
      options: options?.roleOptions ?? [],
      multiple: true,
      label: () => t(Locale.User$Add$Form$Roles),
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
