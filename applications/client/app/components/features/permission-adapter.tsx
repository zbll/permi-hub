import type { Permissions } from "@packages/types";
import { useUserPermissions } from "~/hooks/query/use-user-permissions";
import { Spinner } from "../ui/spinner";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import { usePermission } from "@packages/hooks";
import { ErrorView } from "./error-view";
import type React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { OctagonX, RefreshCcwIcon } from "lucide-react";
import { BrandButton } from "../shared/brand-button";
import { FullLoading } from "./full-loading";

export interface PermissionAdapterProps {
  permissions: Permissions[];
}

export function PermissionAdapter({
  permissions,
  children,
}: React.PropsWithChildren<PermissionAdapterProps>) {
  const { isFetching, data, isPending, isError, error, refetch } =
    useUserPermissions();
  const { checkPermissions, getNeedPermissions } = usePermission();
  const { t } = useTranslation();

  if (isFetching || isPending) {
    return <FullLoading className="h-full" />;
  }

  if (isError) {
    return <ErrorView error={error} />;
  }

  const hasPermission = checkPermissions(permissions, data);

  if (!hasPermission) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <OctagonX />
          </EmptyMedia>
          <EmptyTitle>
            {t(Locale.Text$NeedPermission, {
              permissions: getNeedPermissions(permissions, data),
            })}
          </EmptyTitle>
          <EmptyDescription>
            {t(Locale.Text$NeedPermission$Description)}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <BrandButton variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcwIcon />
            {t(Locale.Text$Refresh)}
          </BrandButton>
        </EmptyContent>
      </Empty>
    );
  }

  return <>{children}</>;
}
