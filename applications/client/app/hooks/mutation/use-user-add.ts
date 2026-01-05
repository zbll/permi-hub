import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUserAdd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
}
