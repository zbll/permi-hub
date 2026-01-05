import { SortDirection } from "@packages/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LogService } from "~/api/log-service/log-service.api";

export function useLogPage(
  cur: number,
  count: number,
  urlFilter: string,
  sortDirection: SortDirection,
) {
  return useQuery({
    queryKey: ["log", "page", cur, count, urlFilter, sortDirection],
    queryFn: () => LogService.page(cur, count, urlFilter, sortDirection),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnMount: true,
  });
}
