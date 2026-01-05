import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUsers() {
  return useQuery({
    queryKey: ["user", "list"],
    queryFn: UserService.list,
    placeholderData: keepPreviousData,
  });
}
