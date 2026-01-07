import { usePermission } from "@packages/hooks";
import type { Permissions } from "@packages/types";
import type React from "react";
import { useUserPermissions } from "~/hooks/query/use-user-permissions";
import { Spinner } from "../ui/spinner";

export interface PermissionViewProps {
  permissions: Permissions[];
}

export function PermissionView({
  permissions,
  children,
}: React.PropsWithChildren<PermissionViewProps>) {
  const { isFetching, data, isPending } = useUserPermissions();
  const { checkPermissions } = usePermission();
  const showLoading = isFetching || isPending;
  const hasPermission = checkPermissions(permissions, data ?? []);
  return (
    <>
      <div className="relative">
        {showLoading || !hasPermission ? (
          <div className="opacity-20">{children}</div>
        ) : (
          children
        )}
        {(showLoading || !hasPermission) && (
          <div className="absolute inset-0 z-10 cursor-not-allowed" />
        )}
        {showLoading && (
          <Spinner className="absolute right-2 top-1/2 -translate-y-1/2" />
        )}
      </div>
    </>
  );
}
