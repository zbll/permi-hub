import React from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserThemeType = "light" | "dark";
export const UserTheme = React.createContext<"light" | "dark">("light");

export interface UserStore {
  token: string;
  setToken: (token: string) => void;
  theme: UserThemeType;
  setTheme: (theme: UserThemeType) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      token: get()?.token ?? "",
      setToken: (token) => set({ token }),
      theme: get()?.theme ?? "light",
      setTheme: (userTheme) => set({ theme: userTheme }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);
