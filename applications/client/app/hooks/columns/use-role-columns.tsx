import type { RoleItemApi } from "@packages/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

export function useRoleColumns() {
  const { t } = useTranslation();
  const tableHelper = createColumnHelper<RoleItemApi>();
}
