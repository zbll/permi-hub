import { useQuery } from "@tanstack/react-query";
import { PermissionService } from "~/api/permission-service/permission-service.api";

export function usePermissions() {
  return useQuery({
    queryKey: ["permission", "list"],
    queryFn: PermissionService.get,
    staleTime: Infinity,
  });
}
