import { SortDirection, type LogItemApi } from "@packages/types";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Locale } from "~/locale/declaration";

export function useLogColumns() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<LogItemApi>();
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );
  const moveToView = (id: string) => {
    navigate(`/log/${id}`);
  };
  return {
    columns: [
      tableHelper.accessor("url", {
        id: "url",
        header: () => t(Locale.Log$Table$Url),
      }),
      tableHelper.accessor("method", {
        id: "method",
        header: () => t(Locale.Log$Table$Method),
      }),
      tableHelper.accessor("isSuccess", {
        id: "isSuccess",
        header: () => t(Locale.Log$Table$IsSuccess),
        cell: ({ row }) => (
          <>
            {row.getValue("isSuccess") ? (
              <Badge variant="secondary">
                {t(Locale.Log$Table$IsSuccess$True)}
              </Badge>
            ) : (
              <Badge variant="destructive">
                {t(Locale.Log$Table$IsSuccess$False)}
              </Badge>
            )}
          </>
        ),
      }),
      tableHelper.accessor("createAt", {
        id: "createAt",
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              if (sortDirection === SortDirection.Desc) {
                setSortDirection(SortDirection.Asc);
              } else {
                setSortDirection(SortDirection.Desc);
              }
            }}
          >
            {t(Locale.Text$CreateAt)}
            {sortDirection === SortDirection.Desc ? <ArrowDown /> : <ArrowUp />}
          </Button>
        ),
        cell: ({ row }) =>
          dayjs(row.getValue("createAt")).format(t(Locale.Template$Full$Date)),
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
                <DropdownMenuItem onClick={() => moveToView(row.original.id)}>
                  {t(Locale.Text$View)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    sortDirection,
  };
}
