import { usePermission } from "@packages/hooks";
import { Permissions } from "@packages/types";
import { CurrentEdit } from "~/components/features/user/current-edit";
import { useUserPermissions } from "~/hooks/query/use-user-permissions";

export default function AccountScreen() {
  const { data: permissions } = useUserPermissions();
  const { checkPermissions } = usePermission();
  return (
    <div>
      {permissions && checkPermissions([Permissions.UserEdit], permissions) && (
        <CurrentEdit />
      )}
    </div>
  );
}
