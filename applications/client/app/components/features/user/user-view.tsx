import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useUser } from "~/hooks/query/use-user";
import { Locale } from "~/locale/declaration";
import dayjs from "dayjs";
import { useAvatarAlt } from "~/hooks/use-avatar-alt";

export function UserView({ id }: { id: string }) {
  const { t } = useTranslation();
  const { isFetching, data } = useUser(id);
  const avatarAlt = useAvatarAlt(data?.nickname);

  return (
    <div className="space-y-6">
      {/* 用户基本信息卡片 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            {isFetching ? (
              <Skeleton className="h-20 w-20 rounded-full" />
            ) : (
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage alt={data?.nickname} />
                <AvatarFallback className="text-2xl">
                  {avatarAlt}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              {isFetching ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl font-bold">
                    {data?.nickname}
                  </CardTitle>
                  <CardDescription>
                    {dayjs(data?.createAt).format(t(Locale.Template$Full$Date))}
                  </CardDescription>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              {t(Locale.User$View$Basic$Info)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t(Locale.User$Table$Email)}
                </p>
                {isFetching ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <p className="text-sm">{data?.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t(Locale.User$Table$LastLoginIp)}
                </p>
                {isFetching ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <p className="text-sm">{data?.ip}</p>
                )}
              </div>
            </div>
          </div>

          {/* 角色信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              {t(Locale.User$Table$Roles)}
            </h3>
            {isFetching ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.roles.map((role: any) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {role.role}
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
