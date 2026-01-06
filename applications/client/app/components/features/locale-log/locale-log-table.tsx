import React from "react";
import { useTranslation } from "react-i18next";
import { BrandTable } from "~/components/shared/brand-table";
import { BrandPagination } from "~/components/shared/brand-pagination";
import { useLocaleLogColumns } from "~/hooks/columns/use-locale-log-columns";
import { useLocaleLogs } from "~/hooks/query/use-locale-logs";
import { useDefineTable } from "~/hooks/use-define-table";
import { Locale } from "~/locale/declaration";

export function LocaleLog() {
  const { t } = useTranslation();
  const { cur, setCur, total, setTotal, rowsPerPage, setRowsPerPage } =
    useDefineTable();
  const { columns } = useLocaleLogColumns();

  const { isPending, data, error } = useLocaleLogs(cur, rowsPerPage);

  // 更新总条数
  React.useEffect(() => {
    setTotal(data?.count ?? 0);
  }, [data?.count, setTotal]);

  return (
    <>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {t(Locale.Log$Locale$Error$FetchFailed)}
        </div>
      )}
      <BrandTable columns={columns} data={data?.list} isPending={isPending} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <BrandPagination
          current={cur}
          page={rowsPerPage}
          total={total}
          onPageChange={(newCurrent, newPageSize) => {
            setCur(newCurrent);
            setRowsPerPage(newPageSize);
          }}
        />
      </div>
    </>
  );
}
