import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { RoleView } from "~/components/features/role/role-view";
import type { Route } from "./+types/role-view";

export default function RoleViewScreen({ params }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.RoleGet]}>
      <RoleView id={Number(params.id)} />
    </PermissionAdapter>
  );
}
