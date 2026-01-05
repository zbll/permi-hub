import { BrandTable } from "~/components/shared/brand-table";
import { useRoleColumns } from "~/hooks/columns/use-role-columns";
import { useRoles } from "~/hooks/query/use-roles";
import { RoleEmpty } from "./role-empty";
import { useState } from "react";
import { RoleDeleteDialog } from "./role-delete-dialog";

export function RoleTable() {
  const { columns } = useRoleColumns({
    onDelete: (id) => {
      setCurrentDeleteId(id);
      setShowDelete(true);
    },
  });
  const { isPending, data } = useRoles();
  const [showDelete, setShowDelete] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<number | null>(null);

  return (
    <>
      <BrandTable
        columns={columns}
        data={data}
        isPending={isPending}
        empty={<RoleEmpty />}
      />
      <RoleDeleteDialog
        show={showDelete}
        setShow={setShowDelete}
        id={currentDeleteId}
      />
    </>
  );
}
