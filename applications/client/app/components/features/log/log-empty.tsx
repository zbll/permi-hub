import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useTranslation } from "react-i18next";
import { Logs } from "lucide-react";
import { Locale } from "~/locale/declaration";

export function LogEmpty() {
  const { t } = useTranslation();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Logs />
        </EmptyMedia>
        <EmptyTitle>{t(Locale.Log$Table$EmptyTitle)}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
