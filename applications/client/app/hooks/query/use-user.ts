import { useQuery } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", "view", id],
    queryFn: () => UserService.get(id),
  });
}
