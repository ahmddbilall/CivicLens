"use client";

import Link from "next/link";
import { Camera, ArrowRight, MapPin } from "lucide-react";
import { useCasesStore } from "@/store/useCasesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CaseCard } from "@/components/features/cases/CaseCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  const { cases } = useCasesStore();
  const { user } = useAuthStore();
  const myCases = cases.filter(c => c.userId === user?.id);

  const totalReports = cases.length;
  const resolvedCases = cases.filter(c => c.status === "resolved").length;
  const inProgressCases = cases.filter(c => c.status === "in_progress").length;

  return (
    <div className="flex flex-col pb-6 md:px-6 lg:px-10 max-w-7xl mx-auto w-full">
      {/* Quick Action Hero Card */}
      <Link href="/report" className="block mx-4 md:mx-0 mt-3 md:mt-6 rounded-2xl overflow-hidden relative shadow-[var(--shadow-card)] active:scale-[0.98] transition-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A6B] to-[#161D2F] pointer-events-none" />
        <div className="absolute inset-0 border border-[var(--color-border)] rounded-2xl border-l-4 border-l-[var(--color-accent)] pointer-events-none" />
        
        {/* Subtle shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] animate-[shimmer_3s_infinite]" />

        <div className="relative p-5 md:p-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-bg-base)]" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-[18px] md:text-[24px]">Report a Fault</h2>
              <p className="text-[12px] md:text-[15px] text-[var(--color-text-secondary)] mt-0.5 md:mt-1">Takes under 60 seconds</p>
            </div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--color-bg-base)] bg-opacity-50 rounded-full flex items-center justify-center border border-[var(--color-border)] hover:bg-opacity-80 transition-colors">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>
      </Link>

      {myCases.length === 0 ? (
        <div className="mt-16 flex flex-col items-center px-8 text-center">
          <div className="w-24 h-24 mb-6 text-[var(--color-border)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10v12M20 10v12M4 10l8-8 8 8M10 22v-6h4v6" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-[20px] md:text-[24px]">No reports yet.</h2>
          <p className="font-body text-[14px] md:text-[16px] text-[var(--color-text-secondary)] mt-2 max-w-md">
            Be the first to report a fault in your area and help keep the city accountable.
          </p>
          <div className="mt-8 w-full max-w-[200px] md:max-w-[240px]">
            <Link href="/report">
              <Button size="lg" className="w-full shadow-[var(--shadow-button)]">Report a Fault</Button>
            </Link>
          </div>
          <p className="text-[12px] md:text-[14px] text-[var(--color-text-muted)] mt-6">
            12 faults resolved in your city this week
          </p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="mx-4 md:mx-0 mt-4 md:mt-8 grid grid-cols-3 gap-3 md:gap-6">
            {[
              { label: "Total Reports", value: totalReports },
              { label: "Resolved", value: resolvedCases },
              { label: "In Progress", value: inProgressCases },
            ].map((stat, i) => (
              <div key={i} className="bg-[var(--color-bg-surface)] rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-[var(--color-border)] shadow-sm">
                <div className="font-mono text-[22px] md:text-[32px] text-white font-bold">{stat.value}</div>
                <div className="text-[11px] md:text-[14px] text-[var(--color-text-muted)] mt-1 tracking-wider uppercase font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 md:mt-10 flex flex-col lg:flex-row gap-6 mx-4 md:mx-0">
            {/* My Reports */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-semibold text-[16px] md:text-[22px]">My Reports</h2>
                <Link href="/cases" className="text-[13px] md:text-[15px] text-[var(--color-accent)] font-medium hover:underline">See all &rarr;</Link>
              </div>
              
              <div className="flex overflow-x-auto gap-3 pb-2 mt-3 md:mt-4 scrollbar-hide snap-x md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-4 md:overflow-visible md:snap-none">
                {myCases.slice(0, 6).map(report => (
                  <div key={report.id} className="min-w-[280px] md:min-w-0 snap-start">
                    <CaseCard report={report} />
                  </div>
                ))}
              </div>
            </div>

            {/* Nearest Offices Strip */}
            <div className="lg:w-[320px] xl:w-[380px] shrink-0 mt-2 lg:mt-0">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <h2 className="font-display font-semibold text-[16px] md:text-[22px]">Nearest Offices</h2>
                <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                {[
                  { name: "WASA HQ Lahore", distance: "2.4 km", status: "Open Now" },
                  { name: "LDA City Office", distance: "5.1 km", status: "Closes 5PM" },
                ].map((office, idx) => (
                  <div key={idx} className="bg-[var(--color-bg-surface)] rounded-xl md:rounded-2xl p-3 md:p-4 border border-[var(--color-border)] flex gap-3 md:gap-4 items-center transition-colors hover:bg-[var(--color-bg-elevated)] cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 bg-[#3B82F615]">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base text-white font-medium truncate">{office.name}</p>
                      <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-0.5">
                        {office.distance}
                      </p>
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[var(--color-success)] bg-[var(--color-success-muted)] px-2 py-1 rounded-sm border border-[var(--color-success)] border-opacity-30">
                      {office.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
