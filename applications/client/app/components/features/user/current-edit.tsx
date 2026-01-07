import { useUserInfo } from "~/hooks/query/use-user-info";
import { useCurrentUserEdit } from "~/hooks/mutation/use-current-user-edit";
import { BrandFormBuilder } from "~/components/shared/form-builder/brand-form-builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { CurrentUserEditApi } from "@packages/types";
import { toast } from "sonner";
import { useEditCurrentUserBuilderOptions } from "~/hooks/builder-options/use-edit-current-user-builder-options";
import { Locale } from "~/locale/declaration";
import { useTranslation } from "react-i18next";

export function CurrentEdit() {
  const { t } = useTranslation();
  const { data: userInfo, isLoading } = useUserInfo();
  const { options } = useEditCurrentUserBuilderOptions(userInfo);
  const editMutation = useCurrentUserEdit();

  const onSubmit = async (data: CurrentUserEditApi) => {
    editMutation.mutate(data, {
      onSuccess: () => toast.success(t(Locale.User$Current$Edit$Success)),
      onError: () => toast.error(t(Locale.User$Current$Edit$Error)),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-6 w-[300px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-5 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Skeleton className="h-10 w-[150px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">账号信息</h1>
        <p className="text-muted-foreground">修改您的账号信息</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
          <CardDescription>修改您的昵称和邮箱</CardDescription>
        </CardHeader>
        <CardContent>
          <BrandFormBuilder options={options} onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
