import type { UserItemApi } from "@packages/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import dayjs from "dayjs";

export function useUserColumns() {
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<UserItemApi>();

  return {
    columns: [
      tableHelper.accessor("nickname", {
        id: "nickname",
        header: () => t(Locale.User$Table$Nickname),
      }),
      tableHelper.accessor("email", {
        id: "email",
        header: () => t(Locale.User$Table$Email),
      }),
      tableHelper.accessor("ip", {
        id: "ip",
        header: () => t(Locale.User$Table$LastLoginIp),
      }),
      tableHelper.accessor("roles", {
        id: "roles",
        header: () => t(Locale.User$Table$Roles),
        cell: ({ row }) => {
          const roles = row.original.roles;
          return roles.map((role: any) => role.role).join(", ");
        },
      }),
      tableHelper.accessor("createAt", {
        id: "createAt",
        header: () => t(Locale.User$Table$CreateAt),
        cell: ({ row }) => {
          return dayjs(row.original.createAt).format(
            t(Locale.Template$Full$Date),
          );
        },
      }),
    ],
  };
}
