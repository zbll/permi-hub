import { BrandTable } from "~/components/shared/brand-table";
import { useUserColumns } from "~/hooks/columns/use-user-columns.tsx";
import { useUsers } from "~/hooks/query/use-users";
import { UserEmpty } from "./user-empty";
import { useState } from "react";
import { UserDeleteDialog } from "./user-delete-dialog";

export function UserTable() {
  const [showDelete, setShowDelete] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);

  const { columns } = useUserColumns({
    onDelete: (id) => {
      setCurrentDeleteId(id);
      setShowDelete(true);
    },
  });

  const { isPending, data } = useUsers();

  return (
    <>
      <BrandTable
        columns={columns}
        data={data}
        isPending={isPending}
        empty={<UserEmpty />}
      />
      <UserDeleteDialog
        show={showDelete}
        setShow={setShowDelete}
        id={currentDeleteId}
      />
    </>
  );
}
