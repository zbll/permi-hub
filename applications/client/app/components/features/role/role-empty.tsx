import { IdCardLanyard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Locale } from "~/locale/declaration";
import { PermissionAdapter } from "../permission-adapter";
import { Permissions } from "@packages/types";

export function RoleEmpty() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IdCardLanyard />
        </EmptyMedia>
        <EmptyTitle>{t(Locale.Role$Table$EmptyTitle)}</EmptyTitle>
        <PermissionAdapter permissions={[Permissions.RoleAdd]}>
          <EmptyDescription>
            {t(Locale.Role$Table$EmptyDescription)}
          </EmptyDescription>
          <EmptyContent>
            <Button onClick={() => navigate("/role/add")}>
              {t(Locale.Role$Table$Create)}
            </Button>
          </EmptyContent>
        </PermissionAdapter>
      </EmptyHeader>
    </Empty>
  );
}
