import { useMutation } from "@tanstack/react-query";
import { UserService } from "~/api/user-service/user-service.api";
import { queryClient } from "~/lib/query-client";
import { removeAuthToken } from "~/lib/utils";

export function useLogout() {
  return useMutation({
    mutationFn: UserService.logout,
    onSuccess: () => {
      removeAuthToken();
      // 退出登录成功后，需要刷新用户认证状态
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
