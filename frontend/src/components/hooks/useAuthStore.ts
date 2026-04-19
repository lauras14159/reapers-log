import { create } from "zustand";
import { getMeApi, loginApi, logoutApi, signupApi } from "../../api/authApi";

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  loading: boolean;
  initialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  fetchMe: async () => {
    try {
      const user = await getMeApi();
      set({ user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const user = await loginApi(email, password);
      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      const user = await signupApi(name, email, password);
      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    await logoutApi();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));
