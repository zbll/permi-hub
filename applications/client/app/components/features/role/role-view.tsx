import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { useRole } from "~/hooks/query/use-role";
import { Locale } from "~/locale/declaration";

export function RoleView({ id }: { id: number }) {
  const { t } = useTranslation();
  const { isFetching, data } = useRole(id);

  return (
    <div className="flex gap-4 items-start">
      {!isFetching && (
        <Item variant="outline" className="w-[40vw]">
          <ItemContent>
            <ItemTitle>{data?.role}</ItemTitle>
            {data && (
              <ItemDescription>
                {dayjs(data.createAt).format(t(Locale.Template$Full$Date))}
              </ItemDescription>
            )}
            <ItemDescription>
              {data?.description || t(Locale.Role$View$Default$Description)}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
      {!isFetching && (
        <Item variant="outline" className="flex-1">
          <ItemContent>
            <ItemTitle>{t(Locale.Role$Add$Form$Permissions)}</ItemTitle>
            {data?.permissions.map((value) => (
              <ItemDescription key={value.id}>
                {value.permission}
              </ItemDescription>
            ))}
          </ItemContent>
        </Item>
      )}
    </div>
  );
}
