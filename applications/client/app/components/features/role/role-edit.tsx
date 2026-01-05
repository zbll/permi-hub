import { useNavigate } from "react-router";
import { useRole } from "~/hooks/query/use-role";
import { createRoleBuilderOptions } from "./role-builder-options";
import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useTranslation } from "react-i18next";
import { useRoleEdit } from "~/hooks/mutation/use-role-edit";

export function RoleEdit({ id }: { id: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useRoleEdit();

  const { isFetching, data } = useRole(id);

  const options = createRoleBuilderOptions(t, {
    role: data?.role ?? "",
    permissions: data?.permissions.map((u) => u.permission) ?? [],
    description: data?.description ?? "",
  });

  const onSubmit = async (value: Record<string, any>) => {
    const formData = new FormData();
    formData.append("role", value.role);
    console.log(value);
    value.permission.forEach((value: string) => {
      formData.append("permissions", value);
    });
    formData.append("description", value.description);
    mutate(
      { id, formData },
      {
        onSuccess: () => navigate("/role"),
        onError: (error) => console.log(error),
      },
    );
  };

  return (
    <>
      {!isFetching && (
        <BrandFormBuilder
          options={options}
          onSubmit={onSubmit}
          onCancel={() => navigate("/role")}
        />
      )}
    </>
  );
}
