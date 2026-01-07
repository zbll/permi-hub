import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useUserAdd } from "~/hooks/mutation/use-user-add";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Locale } from "~/locale/declaration";
import { useRoles } from "~/hooks/query/use-roles";
import type { UserAddApi } from "@packages/types";
import { useAddUserBuilderOptions } from "~/hooks/builder-options/use-add-user-builder-options";

export function UserAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useUserAdd();
  const { data: roleOptions } = useRoles();

  const { options } = useAddUserBuilderOptions({
    roleOptions:
      roleOptions?.map((item) => ({
        value: item.id.toString(),
        label: item.role,
      })) ?? [],
  });

  const onSubmit = async (value: UserAddApi) => {
    if (value.password !== value.confirmPassword) {
      toast.error(t(Locale.User$Add$Password$Not$Match));
      return;
    }
    return new Promise<void>((resolve, reject) => {
      mutate(value, {
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
