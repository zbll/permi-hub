import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { UserEdit } from "~/components/features/user/user-edit";
import type { Route } from "./+types/user-edit";

export default function UserEditScreen({ params }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.UserEdit]}>
      <UserEdit id={params.id} />
    </PermissionAdapter>
  );
}
