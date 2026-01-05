import { useQuery } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUserInfo() {
  return useQuery({
    queryKey: ["user", "info"],
    queryFn: UserService.info,
    staleTime: Infinity,
  });
}
