import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";

export function LogViewHeader() {
  const { t } = useTranslation();

  return (
    <tr className="even:bg-muted m-0 border-t p-0">
      <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
        {t(Locale.Log$View$Key)}
      </th>
      <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
        {t(Locale.Log$View$Value)}
      </th>
    </tr>
  );
}
