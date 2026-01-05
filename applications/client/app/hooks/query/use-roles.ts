import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RoleService } from "~/api/role-service/role-service.api";

export function useRoles() {
  return useQuery({
    queryKey: ["role", "list"],
    queryFn: RoleService.list,
    placeholderData: keepPreviousData,
  });
}
