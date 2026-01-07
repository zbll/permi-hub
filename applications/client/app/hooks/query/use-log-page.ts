import { type LogPageWithFilterApi } from "@packages/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LogService } from "~/api/log-service/log-service.api";

export function useLogPage(option: LogPageWithFilterApi) {
  return useQuery({
    queryKey: [
      "log",
      "page",
      option.cur,
      option.size,
      option.urlFilter,
      option.isSuccessFilter,
      option.requestTypeFilter,
      option.createAtSort,
    ],
    queryFn: () => LogService.page(option),
    placeholderData: keepPreviousData,
  });
}
