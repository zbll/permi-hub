import { Login } from "~/components/features/login/login";
import { LoginWrapper } from "~/components/features/login/login-wrapper";
import { SidebarView } from "~/components/features/sidebar/sidebar-view";
import { useIsAuth } from "~/hooks/query/use-is-auth";
import type { Route } from "../+types/root";
import React, { useState } from "react";

export default function RootLayoutScreen({ matches }: Route.ComponentProps) {
  const { isSuccess } = useIsAuth();
  const [match, setMatch] = useState<any[]>([]);

  React.useEffect(() => {
    setMatch(matches);
  }, [matches]);

  const onLogined = () => {
    console.log("onLogined");
  };

  return (
    <div className="flex">
      {!isSuccess && (
        <LoginWrapper>
          <Login onLogined={onLogined} />
        </LoginWrapper>
      )}
      {isSuccess && <SidebarView match={match} />}
    </div>
  );
}
