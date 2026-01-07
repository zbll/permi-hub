import { Permissions, type UserItemApi } from "@packages/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "~ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { PermissionView } from "~/components/features/permission-view";

export interface UserColumnsProps {
  onDelete: (userId: string) => void;
}

export function useUserColumns({ onDelete }: UserColumnsProps) {
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<UserItemApi>();
  const navigate = useNavigate();

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
      tableHelper.display({
        id: "operation",
        enableHiding: true,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <span className="sr-only">{t(Locale.Text$OpenMenu)}</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t(Locale.Text$Actions)}</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigate(`/user/view/${row.original.id}`)}
                >
                  {t(Locale.Text$View)}
                </DropdownMenuItem>
                <PermissionView permissions={[Permissions.UserEdit]}>
                  <DropdownMenuItem
                    onClick={() => navigate(`/user/edit/${row.original.id}`)}
                  >
                    {t(Locale.Text$Edit)}
                  </DropdownMenuItem>
                </PermissionView>
                <PermissionView permissions={[Permissions.UserDelete]}>
                  <DropdownMenuItem
                    className="text-red-500 data-highlighted:text-red-500"
                    onClick={() => onDelete(row.original.id)}
                  >
                    {t(Locale.Text$Delete)}
                  </DropdownMenuItem>
                </PermissionView>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
  };
}
