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
    if (matches.length === 4 && matches[3]!.id === "routes/log-view") {
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
