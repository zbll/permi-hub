import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { useRole } from "~/hooks/query/use-role";
import { Locale } from "~/locale/declaration";

export function RoleView({ id }: { id: number }) {
  const { t } = useTranslation();
  const { isFetching, data } = useRole(id);

  return (
    <div className="space-y-6">
      {/* 角色详情卡片 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="space-y-1">
            {isFetching ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">
                  {data?.role}
                </CardTitle>
                <CardDescription>
                  {dayjs(data?.createAt).format(t(Locale.Template$Full$Date))}
                </CardDescription>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              {t(Locale.User$View$Basic$Info)}
            </h3>
            {isFetching ? (
              <div className="space-y-3">
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <p className="text-sm">
                {data?.description || t(Locale.Role$View$Default$Description)}
              </p>
            )}
          </div>

          {/* 权限信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              {t(Locale.Role$Add$Form$Permissions)}
            </h3>
            {isFetching ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.permissions.map((permission: any) => (
                  <Badge
                    key={permission.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {permission.permission}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
