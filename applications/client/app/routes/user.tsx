import { UserTable } from "~/components/features/user/user-table";
import type { Route } from "./+types/user";
import { useState } from "react";
import React from "react";
import { Outlet } from "react-router";
import { PermissionAdapter } from "~/components/features/permission-adapter";
import { Permissions } from "@packages/types";
import _ from "lodash";

export default function UserScreen({ matches }: Route.ComponentProps) {
  const [showOutline, setShowOutline] = useState(false);

  React.useEffect(() => {
    const last = _.last(matches);
    setShowOutline(last?.id !== "routes/user");
  }, [matches]);
  return (
    <>
      {!showOutline && (
        <PermissionAdapter permissions={[Permissions.UserGet]}>
          <UserTable />
        </PermissionAdapter>
      )}
      {showOutline && <Outlet />}
    </>
  );
}
