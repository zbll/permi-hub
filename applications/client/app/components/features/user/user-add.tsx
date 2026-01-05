import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useUserAdd } from "~/hooks/mutation/use-user-add";
import { useNavigate } from "react-router";
import { createUserBuilderOptions } from "./user-builder-options";
import { useTranslation } from "react-i18next";

export function UserAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useUserAdd();

  const options = createUserBuilderOptions(t);

  const onSubmit = async (value: Record<string, any>) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("nickname", value.nickname);
      formData.append("email", value.email);
      formData.append("password", value.password);
      formData.append("confirmPassword", value.confirmPassword);
      formData.append("emailCode", value.emailCode);
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
    <BrandFormBuilder
      options={options}
      onSubmit={onSubmit}
      onCancel={() => navigate("/user")}
    />
  );
}
