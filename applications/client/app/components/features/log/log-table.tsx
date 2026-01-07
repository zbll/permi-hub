import type {
  LogPageIsSuccessFilter,
  LogPageRequestTypeFilter,
} from "@packages/types";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrandButton } from "~/components/shared/brand-button";
import { BrandPagination } from "~/components/shared/brand-pagination";
import { BrandTable } from "~/components/shared/brand-table";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useLogColumns } from "~/hooks/columns/use-log-columns";
import { useLogPage } from "~/hooks/query/use-log-page";
import { useDefineTable } from "~/hooks/use-define-table";
import { Locale } from "~/locale/declaration";
import { LogEmpty } from "./log-empty";

export function LogTable() {
  const { t } = useTranslation();
  const { cur, setCur, total, setTotal, rowsPerPage, setRowsPerPage } =
    useDefineTable();
  const { columns, sortDirection } = useLogColumns();
  const [urlFilter, setUrlFilter] = useState("");
  const [isSuccessFilter, setIsSuccessFilter] =
    useState<LogPageIsSuccessFilter>("all");
  const [requestTypeFilter, setRequestTypeFilter] =
    useState<LogPageRequestTypeFilter>("all");

  const { isPending, isFetching, data } = useLogPage({
    cur,
    size: rowsPerPage,
    urlFilter,
    isSuccessFilter,
    requestTypeFilter,
    createAtSort: sortDirection,
  });

  React.useEffect(() => {
    setTotal(data?.count ?? 0);
  }, [data?.count]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFetching) return;
    const formData = new FormData(e.target as HTMLFormElement);
    setCur(1);
    setUrlFilter(formData.get("urlFilter") as string);
    setIsSuccessFilter(
      formData.get("isSuccessFilter") as LogPageIsSuccessFilter,
    );
    setRequestTypeFilter(
      formData.get("requestTypeFilter") as LogPageRequestTypeFilter,
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-between">
        <div className="flex mr-4 gap-4 overflow-x-auto">
          <Input
            placeholder={t(Locale.Log$Table$Filter$Url$Placeholder)}
            className="w-50 shrink-0"
            name="urlFilter"
          />
          <Select
            name="isSuccessFilter"
            value={isSuccessFilter}
            onValueChange={(e: LogPageIsSuccessFilter) => setIsSuccessFilter(e)}
          >
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(Locale.Text$All)}</SelectItem>
              <SelectItem value="success">
                {t(Locale.Log$Table$IsSuccess$True)}
              </SelectItem>
              <SelectItem value="fail">
                {t(Locale.Log$Table$IsSuccess$False)}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            name="requestTypeFilter"
            value={requestTypeFilter}
            onValueChange={(e: LogPageRequestTypeFilter) =>
              setRequestTypeFilter(e)
            }
          >
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(Locale.Text$All)}</SelectItem>
              <SelectItem value="get">
                {t(Locale.Log$Table$Filter$RequestType$Get)}
              </SelectItem>
              <SelectItem value="post">
                {t(Locale.Log$Table$Filter$RequestType$Post)}
              </SelectItem>
              <SelectItem value="delete">
                {t(Locale.Log$Table$Filter$RequestType$Delete)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <BrandButton
          type="submit"
          isLoading={isFetching}
          variant="outline"
          size="default"
        >
          {t(Locale.Text$Filter)}
        </BrandButton>
      </form>
      <BrandTable
        columns={columns}
        data={data?.list}
        isPending={isPending}
        empty={<LogEmpty />}
      />
      <div className="flex items-center justify-end space-x-2 py-4">
        <BrandPagination
          current={cur}
          page={rowsPerPage}
          total={total}
          onPageChange={(e, page) => {
            setCur(e);
            setRowsPerPage(page);
          }}
        />
      </div>
    </>
  );
}
