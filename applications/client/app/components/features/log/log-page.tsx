import React from "react";
import { Outlet } from "react-router";
import { BrandTable } from "~/components/shared/brand-table";
import { useLogPage } from "~/hooks/query/use-log-page";
import { BrandPagination } from "~/components/shared/brand-pagination";
import { useLogColumns } from "~/hooks/columns/use-log-columns";
import { useDefineTable } from "~/hooks/use-define-table";
import { Input } from "~/components/ui/input";
import { Locale } from "~/locale/declaration";
import { useTranslation } from "react-i18next";
import { BrandButton } from "~/components/shared/brand-button";

export interface LogPageProps {
  matches: any[];
}

export default function LogScreen({ matches }: LogPageProps) {
  const { t } = useTranslation();
  const { cur, setCur, total, setTotal, showView, setShowView } =
    useDefineTable();
  const { columns, sortDirection } = useLogColumns();

  const { isPending, data } = useLogPage(cur, 10, sortDirection);

  React.useEffect(() => {
    setTotal(data?.count ?? 0);
  }, [data?.count]);

  React.useEffect(() => {
    if (matches.length === 4 && matches[3]!.id === "routes/log-view") {
      setShowView(true);
    } else {
      setShowView(false);
    }
  }, [matches]);

  return (
    <>
      {!showView && (
        <>
          <div className="flex justify-between pb-2">
            <Input
              placeholder={t(Locale.Log$Table$Filter$Url$Placeholder)}
              className="max-w-sm"
            />
            <BrandButton variant="outline" size="default">
              {t(Locale.Text$Filter)}
            </BrandButton>
          </div>
          <BrandTable
            columns={columns}
            data={data?.list}
            isPending={isPending}
          />
          <div className="flex items-center justify-end space-x-2 py-4">
            <BrandPagination
              current={cur}
              page={10}
              total={total}
              onPageChange={(e) => setCur(e)}
            />
          </div>
        </>
      )}
      {showView && <Outlet />}
    </>
  );
}
