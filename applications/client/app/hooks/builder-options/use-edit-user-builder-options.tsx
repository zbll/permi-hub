import type { UserEditApi, UserItemApi } from "@packages/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MailService } from "~/api/mail-service/mail-service.api";
import type { BuilderWithSubmitOptions } from "~/components/shared/form-builder/brand-form-builder";
import type { SelectFormOption } from "~/components/shared/form-builder/select-from-builder";
import { Locale } from "~/locale/declaration";

export interface EditUserBuilderOptionsProps {
  data?: UserItemApi;
  roleOptions: SelectFormOption[];
}

export function useEditUserBuilderOptions({
  data,
  roleOptions,
}: EditUserBuilderOptionsProps) {
  const { t } = useTranslation();

  const options: BuilderWithSubmitOptions<UserEditApi> = {
    nickname: {
      type: "text",
      required: true,
      defaultValue: data?.nickname ?? "",
      error: () => t(Locale.User$Add$Form$Nickname$Empty),
      label: () => t(Locale.User$Add$Form$Nickname),
    },
    email: {
      type: "email",
      required: true,
      defaultValue: data?.email ?? "",
      autoComplete: "email",
      error: () => t(Locale.User$Add$Form$Email$Empty),
      label: () => t(Locale.User$Add$Form$Email),
    },
    emailCode: {
      type: "code",
      required: false,
      defaultValue: "",
      length: {
        value: 6,
        error: () => t(Locale.User$Add$Form$EmailCode$Empty),
      },
      action: {
        text: () => t(Locale.User$Add$Form$SendEmailCode),
        onClick: async (formValues) => {
          if (!formValues.email) {
            toast.error(t(Locale.User$Add$Form$Email$Empty));
            throw new Error(t(Locale.User$Add$Form$Email$Empty));
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
    roles: {
      type: "select",
      defaultValue: data?.roles ?? [],
      options: roleOptions ?? [],
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

  return {
    options,
  };
}
