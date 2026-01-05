import { PermissionAdapter } from "~/components/features/permission-adapter";
import type { Route } from "./+types/log-view";
import "@rexxars/react-json-inspector/json-inspector.css";
import { Permissions } from "@packages/types";
import { LogView } from "~components/features/log/log-view";

export default function logViewScreen({ params }: Route.ComponentProps) {
  return (
    <PermissionAdapter permissions={[Permissions.LoggerGet]}>
      <LogView id={params.id} />
    </PermissionAdapter>
  );
}
