import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { RoleEdit } from "~/components/features/role/role-edit";
import type { Route } from "./+types/role-edit";

export default function RoleEditScreen({ params }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.RoleEdit]}>
      <RoleEdit id={Number(params.id)} />
    </PermissionAdapter>
  );
}
