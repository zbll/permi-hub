import { useMutation } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";
import { queryClient } from "~/lib/query-client";

export function useCurrentUserEdit() {
  return useMutation({
    mutationFn: UserService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "info"] });
    },
  });
}
