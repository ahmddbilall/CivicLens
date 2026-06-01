import { create } from "zustand";

interface ReportDraft {
  photoUrl: string | null;
  faultType?: string;
  severity?: string;
  description?: string;
  location?: { lat: number; lng: number; address: string; city: string };
  authority?: { name: string; department: string; email: string; phone: string; hours: string; };
  sendEmail?: boolean;
  postSocial?: boolean;
}

interface ReportState {
  draft: ReportDraft;
  setDraft: (data: Partial<ReportDraft>) => void;
  resetDraft: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  draft: {
    photoUrl: null,
    sendEmail: true,
    postSocial: true,
  },
  setDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
  resetDraft: () => set({ draft: { photoUrl: null, sendEmail: true, postSocial: true } }),
}));
