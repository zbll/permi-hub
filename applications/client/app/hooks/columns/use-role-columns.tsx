import { type RoleItemApi } from "@packages/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import { Locale } from "~/locale/declaration";
import { useMediaConfig } from "../use-media-config";
import { MediaConfig } from "~/lib/utils";
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
import dayjs from "dayjs";

export interface RoleColumnsProps {
  onDelete: (roleId: number) => void;
}

export function useRoleColumns({ onDelete }: RoleColumnsProps) {
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<RoleItemApi>();
  const { currentValue } = useMediaConfig(MediaConfig.RolePermssion);
  const navigate = useNavigate();

  return {
    columns: [
      tableHelper.accessor("role", {
        id: "role",
        header: () => t(Locale.Role$Table$Role),
      }),
      tableHelper.accessor("permissions", {
        id: "permissions",
        header: () => t(Locale.Role$Table$Permissions),
        cell: ({ row }) => {
          const list: { id: number; text: string }[] = [];
          for (
            let i = 0,
              length =
                row.original.permissions.length > currentValue
                  ? currentValue
                  : row.original.permissions.length;
            i < length;
            i++
          ) {
            list.push({
              id: row.original.permissions[i].id,
              text: row.original.permissions[i].permission,
            });
          }
          if (row.original.permissions.length > currentValue) {
            list.push({
              id: Math.random(),
              text: `+${row.original.permissions.length - currentValue}`,
            });
          }
          return (
            <div className="flex gap-1">
              {list.map((value) => (
                <Badge variant="secondary" key={value.id}>
                  {value.text}
                </Badge>
              ))}
            </div>
          );
        },
      }),
      tableHelper.accessor("createAt", {
        id: "createAt",
        header: () => t(Locale.Text$CreateAt),
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
                  onClick={() => navigate(`/role/view/${row.original.id}`)}
                >
                  {t(Locale.Text$View)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/role/edit/${row.original.id}`)}
                >
                  {t(Locale.Text$Edit)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 data-highlighted:text-red-500"
                  onClick={() => onDelete(row.original.id)}
                >
                  {t(Locale.Text$Delete)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
  };
}
