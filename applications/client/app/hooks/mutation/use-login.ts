import { useMutation } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";

export function useLogin() {
  return useMutation({
    mutationFn: UserService.login,
  });
}
