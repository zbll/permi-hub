import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { RolePage } from "~/components/features/role/role-page";

export default function RoleScreen() {
  return (
    <PermissionAdapter permissions={[Permissions.RoleGet]}>
      <RolePage />
    </PermissionAdapter>
  );
}
