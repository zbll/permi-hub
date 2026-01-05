import { RoleTable } from "~/components/features/role/role-table";
import _ from "lodash";
import type { Route } from "./+types/role";
import { useState } from "react";
import React from "react";
import { Outlet } from "react-router";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { Permissions } from "@packages/types";

export default function RoleScreen({ matches }: Route.ComponentProps) {
  const [showOutline, setShowOutline] = useState(false);

  React.useEffect(() => {
    const last = _.last(matches);
    setShowOutline(last?.id !== "routes/role");
  }, [matches]);
  return (
    <>
      {!showOutline && (
        <PermissionAdapter permissions={[Permissions.RoleGet]}>
          <RoleTable />
        </PermissionAdapter>
      )}
      {showOutline && <Outlet />}
    </>
  );
}
