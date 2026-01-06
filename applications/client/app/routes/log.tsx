import { useState } from "react";
import type { Route } from "./+types/log";
import { Permissions } from "@packages/types";
import React from "react";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { LogTable } from "~/components/features/log/log-table";
import { Outlet } from "react-router";

export default function LogScreen({ matches }: Route.ComponentProps) {
  const [showView, setShowView] = useState(false);

  React.useEffect(() => {
    if (
      matches.length === 4 &&
      ["routes/log-view", "routes/locale-log"].includes(matches[3]!.id)
    ) {
      setShowView(true);
    } else {
      setShowView(false);
    }
  }, [matches]);
  return (
    <>
      {!showView && (
        <PermissionAdapter permissions={[Permissions.LoggerGet]}>
          <LogTable />
        </PermissionAdapter>
      )}
      {showView && <Outlet />}
    </>
  );
}
