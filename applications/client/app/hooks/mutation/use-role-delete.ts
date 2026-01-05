import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService } from "~/api/role-service/role-service.api";

export function useRoleDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RoleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
  });
}
