import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useUserDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
