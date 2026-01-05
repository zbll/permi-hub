import { useQuery } from "@tanstack/react-query";
import { RoleService } from "~/api/role-service/role-service.api";

export function useRole(id: number) {
  return useQuery({
    queryKey: ["role", "view", id],
    queryFn: () => RoleService.get(id),
  });
}
