import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

type AuthIntent = "login" | "signup" | null;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authIntent: AuthIntent;
  startAuth: (payload: {
    email: string;
    name?: string;
    intent: Exclude<AuthIntent, null>;
  }) => void;
  verifyOtp: (otp: string) => void;
  clearAuthIntent: () => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authIntent: null,
      startAuth: ({ email, name, intent }) =>
        set((state) => ({
          user: {
            id: state.user?.id || "1",
            name: name || state.user?.name || "",
            phone: state.user?.phone || "",
            email,
            street: state.user?.street || "",
            area: state.user?.area || "",
            zip: state.user?.zip || "",
            city: state.user?.city || "",
            avatarUrl: state.user?.avatarUrl,
          },
          isAuthenticated: false,
          authIntent: intent,
        })),
      verifyOtp: () => set({ isAuthenticated: true }),
      clearAuthIntent: () => set({ authIntent: null }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () =>
        set({ user: null, isAuthenticated: false, authIntent: null }),
    }),
    { name: "auth-storage" },
  ),
);
