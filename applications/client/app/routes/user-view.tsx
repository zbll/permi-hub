import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { UserView } from "~/components/features/user/user-view";
import type { Route } from "./+types/user-view";

export default function UserViewScreen({ params }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.UserGet]}>
      {params.id && <UserView id={params.id} />}
    </PermissionAdapter>
  );
}
