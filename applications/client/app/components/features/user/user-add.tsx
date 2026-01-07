import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useUserAdd } from "~/hooks/mutation/use-user-add";
import { useNavigate } from "react-router";
import { createUserBuilderOptions } from "./user-builder-options";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Locale } from "~/locale/declaration";
import { useRoles } from "~/hooks/query/use-roles";
import type { UserAddApi } from "@packages/types";

export function UserAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useUserAdd();
  const { data: roleOptions } = useRoles();

  const options = createUserBuilderOptions(t, {
    roleOptions:
      roleOptions?.map((item) => ({
        value: item.id.toString(),
        label: item.role,
      })) ?? [],
  });

  const onSubmit = async (value: UserAddApi) => {
    if (value.password !== value.confirmPassword) {
      toast.error(t(Locale.User$Add$Password$Not$Match), {
        position: "top-center",
      });
      return;
    }
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("nickname", value.nickname);
      formData.append("email", value.email);
      formData.append("password", value.password);
      formData.append("confirmPassword", value.confirmPassword);
      formData.append("emailCode", value.emailCode);
      console.log(value);
      value.roles.map((role) => formData.append("role", role.toString()));
      mutate(formData, {
        onSuccess: () => {
          navigate("/user");
          resolve();
        },
        onError: (e) => {
          console.log(e);
          reject(e);
        },
      });
    });
  };

  return (
    <>
      <BrandFormBuilder
        options={options}
        onSubmit={onSubmit}
        onCancel={() => navigate("/user")}
      />
    </>
  );
}
