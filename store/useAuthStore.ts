import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signOut } from "next-auth/react";
import { User } from "@/types";
import toast from "react-hot-toast";

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
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  fetchUser: () => Promise<void>;
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
      updateProfile: async (data) => {
        try {
          const res = await fetch("/api/users/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const updatedUser = await res.json();
            set({ user: updatedUser });
            return true;
          } else {
            const err = await res.json();
            toast.error(err.error || "Failed to update profile");
            return false;
          }
        } catch (error) {
          console.error("Failed to update profile", error);
          toast.error("Network error while updating profile");
          return false;
        }
      },
      fetchUser: async () => {
        try {
          const res = await fetch("/api/users/profile");
          if (res.ok) {
            const user = await res.json();
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, authIntent: null });
        signOut({ callbackUrl: "/login" });
      },
    }),
    { name: "auth-storage" },
  ),
);
