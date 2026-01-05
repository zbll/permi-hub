import { User } from "lucide-react";
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

export function UserEmpty() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <User />
        </EmptyMedia>
        <EmptyTitle>{t(Locale.User$Table$EmptyTitle)}</EmptyTitle>
        <PermissionAdapter permissions={[Permissions.UserAdd]}>
          <EmptyDescription>
            {t(Locale.User$Table$EmptyDescription)}
          </EmptyDescription>
          <EmptyContent>
            <Button onClick={() => navigate("/user/add")}>
              {t(Locale.User$Table$Create)}
            </Button>
          </EmptyContent>
        </PermissionAdapter>
      </EmptyHeader>
    </Empty>
  );
}
