import { useQuery } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useIsAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: UserService.isAuth,
    retry: false,
  });
}
