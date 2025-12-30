import type { PropsWithChildren } from "react";

export function LoginWrapper({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      {children}
    </div>
  );
}
