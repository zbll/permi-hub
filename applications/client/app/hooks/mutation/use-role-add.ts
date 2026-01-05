import { useMutation } from "@tanstack/react-query";
import { RoleService } from "~/api/role-service/role-service.api";
import { queryClient } from "~/lib/query-client";

export function useRoleAdd() {
  return useMutation({
    mutationFn: RoleService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
    },
  });
}
