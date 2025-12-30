import { useQuery } from "@tanstack/react-query";
import { LogService } from "~/api/log-service/log-service.api";

export function useLogView(id: string) {
  return useQuery({
    queryKey: ["log", "view", id],
    queryFn: () => LogService.view(id),
    retry: false,
  });
}
