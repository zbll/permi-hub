import { useMutation } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";
import { queryClient } from "~/lib/query-client";

export function useLogin() {
  return useMutation({
    mutationFn: UserService.login,
    onSuccess: () => {
      // 登录成功后，清除所有缓存
      queryClient.invalidateQueries();
    },
  });
}
