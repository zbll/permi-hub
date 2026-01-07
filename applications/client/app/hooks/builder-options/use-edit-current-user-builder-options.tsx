import type { CurrentUserEditApi, UserInfoApi } from "@packages/types";
import { useTranslation } from "react-i18next";
import type { BuilderWithSubmitOptions } from "~/components/shared/form-builder/brand-form-builder";
import { Locale } from "~/locale/declaration";

export function useEditCurrentUserBuilderOptions(userInfo?: UserInfoApi) {
  const { t } = useTranslation();
  const options: BuilderWithSubmitOptions<CurrentUserEditApi> = {
    nickname: {
      type: "text",
      label: () => t(Locale.User$Current$Edit$Nickname),
      description: () => t(Locale.User$Current$Edit$Nickname$Desc),
      required: true,
      defaultValue: userInfo?.nickname || "",
      maxLength: {
        value: 20,
        error: () => t(Locale.User$Current$Edit$Nickname$MaxLength),
      },
      minLength: {
        value: 2,
        error: () => t(Locale.User$Current$Edit$Nickname$MinLength),
      },
      error: () => t(Locale.User$Current$Edit$Nickname$Empty),
    },
    email: {
      type: "email",
      label: () => t(Locale.User$Current$Edit$Nickname$Email),
      description: () => t(Locale.User$Current$Edit$Nickname$Email$Desc),
      required: true,
      defaultValue: userInfo?.email || "",
      error: () => t(Locale.User$Current$Edit$Nickname$Email$Empty),
    },
    submit: {
      type: "submit",
      text: () => t(Locale.Text$Confirm),
    },
  };
  return { options };
}
