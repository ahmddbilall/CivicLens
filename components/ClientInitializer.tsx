"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCasesStore } from "@/store/useCasesStore";
import { SessionProvider } from "next-auth/react";

export function ClientInitializer({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuthStore();
  const { fetchCases } = useCasesStore();

  useEffect(() => {
    fetchUser();
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
