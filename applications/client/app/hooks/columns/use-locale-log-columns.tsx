import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import type { LocalLogItem } from "@packages/types";
import dayjs from "dayjs";

export function useLocaleLogColumns() {
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<LocalLogItem>();

  return {
    columns: [
      tableHelper.accessor("level", {
        id: "level",
        header: () => t(Locale.Log$Locale$Column$Level),
        cell: ({ row }) => {
          const text = row.getValue("level") as string;
          let levelClass = "";
          switch (text.toLowerCase()) {
            case "danger":
              levelClass = "text-red-600 font-bold";
              break;
            case "warn":
              levelClass = "text-yellow-600 font-semibold";
              break;
            case "info":
              levelClass = "text-blue-600";
              break;
            case "success":
              levelClass = "text-green-600";
              break;
            default:
              levelClass = "text-gray-800";
          }
          return <span className={levelClass}>{text}</span>;
        },
      }),
      tableHelper.accessor("message", {
        id: "message",
        header: () => t(Locale.Log$Locale$Column$Message),
        cell: ({ row }) => {
          const text = row.getValue("message") as string;
          return (
            <div className="truncate max-w-[600px] whitespace-pre-wrap overflow-hidden text-ellipsis">
              {text}
            </div>
          );
        },
      }),
      tableHelper.accessor("timestamp", {
        id: "timestamp",
        header: () => t(Locale.Log$Locale$Column$Timestamp),
        cell: ({ row }) => {
          const text = row.getValue("timestamp") as string;
          return dayjs(text).format(t(Locale.Template$Full$Date));
        },
      }),
    ],
  };
}
