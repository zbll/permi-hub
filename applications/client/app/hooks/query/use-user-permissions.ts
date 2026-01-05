import { useQuery } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUserPermissions() {
  return useQuery({
    queryKey: ["user", "permissions"],
    queryFn: UserService.permission,
    staleTime: Infinity,
  });
}
