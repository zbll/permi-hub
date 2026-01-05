import { useMutation } from "@tanstack/react-query";
import { RoleService } from "~/api/role-service/role-service.api";
import { queryClient } from "~/lib/query-client";

export function useRoleEdit() {
  return useMutation({
    mutationFn: RoleService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
    },
  });
}
