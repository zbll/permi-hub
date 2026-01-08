import { useUser } from "~/hooks/query/use-user";
import { FullLoading } from "../full-loading";
import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import { useEditUserBuilderOptions } from "~/hooks/builder-options/use-edit-user-builder-options";
import { useNavigate } from "react-router";
import type { UserEditApi } from "@packages/types";

export function UserEdit({ id }: { id: string }) {
  const navigate = useNavigate();
  const { isPending, isFetching, data } = useUser(id);

  const { options } = useEditUserBuilderOptions({ data, roleOptions: [] });

  const onSubmit = async (value: UserEditApi) => {
    console.log(value);
  };

  if (!data) return <FullLoading className="h-full" />;

  return (
    <>
      {(isPending || isFetching) && <FullLoading className="h-full" />}
      {data && (
        <BrandFormBuilder
          options={options}
          onCancel={() => navigate(-1)}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}
