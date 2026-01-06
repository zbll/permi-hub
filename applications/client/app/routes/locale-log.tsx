import { Permissions } from "@packages/types";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { LocaleLog } from "~/components/features/locale-log/locale-log-table";

export default function LocaleLogScreen() {
  return (
    <PermissionAdapter permissions={[Permissions.LocaleLogger]}>
      <LocaleLog />
    </PermissionAdapter>
  );
}
