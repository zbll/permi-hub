import { BrandTable } from "~/components/shared/brand-table";
import { useUserColumns } from "~/hooks/columns/use-user-columns";
import { useUsers } from "~/hooks/query/use-users";
import { UserEmpty } from "./user-empty";

export function UserTable() {
  const { columns } = useUserColumns();
  const { isPending, data } = useUsers();

  return (
    <BrandTable
      columns={columns}
      data={data}
      isPending={isPending}
      empty={<UserEmpty />}
    />
  );
}
