"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

export default function LanguagePreferencesScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-[80vh] bg-[var(--color-bg-base)] px-6 pt-4 pb-8 w-full max-w-xl mx-auto md:mt-8">
      <div className="flex items-center gap-4 mb-4 mt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-display font-semibold text-[24px]">Language & Region</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">App Language</h2>
          <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
            <button className="w-full px-5 py-4 flex items-center justify-between bg-[var(--color-bg-elevated)]/30">
              <span className="font-medium text-[15px]">English (US)</span>
              <Check className="w-5 h-5 text-[var(--color-accent)]" />
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors">
              <span className="font-medium text-[15px]">Urdu (اردو)</span>
            </button>
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors">
              <span className="font-medium text-[15px]">Roman Urdu</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">Region</h2>
          <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
            <button className="w-full px-5 py-4 flex items-center justify-between bg-[var(--color-bg-elevated)]/30">
              <span className="font-medium text-[15px]">Pakistan</span>
              <Check className="w-5 h-5 text-[var(--color-accent)]" />
            </button>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-2 ml-2">
            Region is automatically set based on your default location to match you with local authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
