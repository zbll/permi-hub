import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useRoleAdd } from "~/hooks/mutation/use-role-add";
import { useNavigate } from "react-router";
import { createRoleBuilderOptions } from "./role-builder-options";
import { useTranslation } from "react-i18next";

export function RoleAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useRoleAdd();

  const options = createRoleBuilderOptions(t);

  const onSubmit = async (value: Record<string, any>) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("role", value.role);
      value.permission.forEach((permission: string) => {
        formData.append("permissions", permission);
      });
      formData.append("description", value.description);
      mutate(formData, {
        onSuccess: () => {
          navigate("/role");
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
    <BrandFormBuilder
      options={options}
      onSubmit={onSubmit}
      onCancel={() => navigate("/role")}
    />
  );
}
