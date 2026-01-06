import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LogService } from "~/api/log-service/log-service.api";

export function useLocaleLogs(cur = 1, size = 20) {
  return useQuery({
    queryKey: ["log", "local", cur, size],
    queryFn: () => LogService.getLocalLogs(cur, size),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnMount: true,
  });
}
