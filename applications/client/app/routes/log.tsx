import type { Route } from "./+types/log";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { Permissions } from "@packages/types";
import LogPage from "~/components/features/log/log-page";

export default function LogScreen({ matches }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.LoggerGet]}>
      <LogPage matches={matches} />
    </PermissionAdapter>
  );
}
