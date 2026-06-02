import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Report } from "@/types";
import toast from "react-hot-toast";

interface CasesState {
  cases: Report[];
  addCase: (newCase: Partial<Report>) => Promise<string | undefined>;
  fetchCases: () => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  resolveCase: (id: string) => Promise<void>;
}

export const useCasesStore = create<CasesState>()(
  persist(
    (set) => ({
      cases: [],
      fetchCases: async () => {
        try {
          const res = await fetch("/api/reports");
          if (res.ok) {
            const data = await res.json();
            set({ cases: data });
          }
        } catch (error) {
          console.error("Failed to fetch cases", error);
        }
      },
      addCase: async (newCase) => {
        try {
          const res = await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCase),
          });
          if (res.ok) {
            const createdCase = await res.json();
            set((state) => ({ cases: [createdCase, ...state.cases] }));
            return createdCase.id;
          } else {
            const err = await res.json();
            toast.error(err.error || "Failed to add case");
            return undefined;
          }
        } catch (error) {
          console.error("Failed to add case", error);
          toast.error("Failed to add case");
          return undefined;
        }
      },
      deleteCase: async (id) => {
        try {
          const res = await fetch(`/api/reports/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            set((state) => ({ cases: state.cases.filter(c => c.id !== id) }));
            toast.success("Case deleted");
          } else {
            const err = await res.json();
            toast.error(err.error || "Failed to delete case");
          }
        } catch (error) {
          console.error("Failed to delete case", error);
          toast.error("Failed to delete case");
        }
      },
      resolveCase: async (id) => {
        try {
          const res = await fetch(`/api/reports/${id}/resolve`, {
            method: "PUT",
          });
          if (res.ok) {
            const resolvedCase = await res.json();
            set((state) => ({
              cases: state.cases.map((c) =>
                c.id === id ? resolvedCase : c
              ),
            }));
            toast.success("Case marked as resolved");
          } else {
            const err = await res.json();
            toast.error(err.error || "Failed to resolve case");
          }
        } catch (error) {
          console.error("Failed to resolve case", error);
          toast.error("Failed to resolve case");
        }
      },
    }),
    { name: "cases-storage" }
  )
);
