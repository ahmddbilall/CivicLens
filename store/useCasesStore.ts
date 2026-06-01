import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Report } from "@/types";

interface CasesState {
  cases: Report[];
  addCase: (newCase: Report) => void;
  resolveCase: (id: string) => void;
}

export const useCasesStore = create<CasesState>()(
  persist(
    (set) => ({
      cases: [],
      addCase: (newCase) => set((state) => ({ cases: [newCase, ...state.cases] })),
      resolveCase: (id) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "resolved",
                  resolvedAt: new Date().toISOString(),
                  timeline: [
                    ...c.timeline,
                    { id: Date.now().toString(), type: "resolved", label: "Marked as Resolved", date: new Date().toISOString() },
                  ],
                }
              : c
          ),
        })),
    }),
    { name: "cases-storage" }
  )
);
