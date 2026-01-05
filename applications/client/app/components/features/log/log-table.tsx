import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrandButton } from "~/components/shared/brand-button";
import { BrandPagination } from "~/components/shared/brand-pagination";
import { BrandTable } from "~/components/shared/brand-table";
import { Input } from "~/components/ui/input";
import { useLogColumns } from "~/hooks/columns/use-log-columns";
import { useLogPage } from "~/hooks/query/use-log-page";
import { useDefineTable } from "~/hooks/use-define-table";
import { Locale } from "~/locale/declaration";

export function LogTable() {
  const { t } = useTranslation();
  const { cur, setCur, total, setTotal, rowsPerPage, setRowsPerPage } =
    useDefineTable();
  const { columns, sortDirection } = useLogColumns();
  const [urlFilter, setUrlFilter] = useState("");

  const { isPending, isFetching, data } = useLogPage(
    cur,
    rowsPerPage,
    urlFilter,
    sortDirection,
  );

  React.useEffect(() => {
    setTotal(data?.count ?? 0);
  }, [data?.count]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFetching) return;
    const formData = new FormData(e.target as HTMLFormElement);
    setCur(1);
    setUrlFilter(formData.get("urlFilter") as string);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-between pb-2">
        <Input
          placeholder={t(Locale.Log$Table$Filter$Url$Placeholder)}
          className="max-w-sm"
          name="urlFilter"
        />
        <BrandButton
          type="submit"
          isLoading={isFetching}
          variant="outline"
          size="default"
        >
          {t(Locale.Text$Filter)}
        </BrandButton>
      </form>
      <BrandTable columns={columns} data={data?.list} isPending={isPending} />
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
