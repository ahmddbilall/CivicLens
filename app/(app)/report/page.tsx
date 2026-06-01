"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image as ImageIcon, Video } from "lucide-react";
import { useReportStore } from "@/store/useReportStore";

export default function ReportScreen() {
  const router = useRouter();
  const { setDraft } = useReportStore();

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setDraft({ photoUrl: url });
      router.push("/report/preview");
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen px-4 pb-8 max-w-xl mx-auto w-full justify-center">
      <div className="mt-6 flex flex-col gap-4">
        {/* Upload from Gallery */}
        <label className="h-64 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] hover:border-dashed hover:border-[var(--color-accent)] transition-all flex flex-col items-center justify-center cursor-pointer active:scale-[0.98]">
          <div className="w-16 h-16 bg-[var(--color-accent-muted)] rounded-full flex items-center justify-center mb-4 shadow-[var(--color-accent)] shadow-sm">
            <ImageIcon className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h2 className="font-display font-semibold text-[20px]">Upload Photo</h2>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">Choose an image of the fault</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleCapture} />
        </label>
      </div>

      {/* Tip Strip */}
      <div className="mt-4 bg-[var(--color-accent-muted)] border border-[var(--color-accent)] border-opacity-30 rounded-xl px-4 py-3 flex gap-3">
        <span className="text-[14px]">💡</span>
        <p className="text-[12px] text-[var(--color-accent)]">
          Clear, close-up photos help AI classify the fault more accurately.
        </p>
      </div>
    </div>
  );
}
