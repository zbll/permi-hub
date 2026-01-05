import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { RoleAdd } from "~/components/features/role/role-add";

export default function RoleAddScreen() {
  return (
    <PermissionAdapter permissions={[Permissions.RoleAdd]}>
      <RoleAdd />
    </PermissionAdapter>
  );
}
