import { SortDirection } from "@packages/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LogService } from "~/api/log-service/log-service.api";

export function useLogPage(
  cur: number,
  count: number,
  sortDirection: SortDirection,
) {
  return useQuery({
    queryKey: ["log", "page", cur, sortDirection],
    queryFn: () => LogService.page(cur, count, sortDirection),
    placeholderData: keepPreviousData,
  });
}
