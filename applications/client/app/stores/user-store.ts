import { create } from "zustand";

export interface UserStore {
  token: string;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  token: "",
  setToken: (token) => set({ token }),
}));
