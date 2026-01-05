import { UserAdd } from "~/components/features/user/user-add";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { Permissions } from "@packages/types";

export default function UserAddScreen() {
  return (
    <PermissionAdapter permissions={[Permissions.UserAdd]}>
      <UserAdd />
    </PermissionAdapter>
  );
}
