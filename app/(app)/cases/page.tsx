"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCasesStore } from "@/store/useCasesStore";
import { CaseCard } from "@/components/features/cases/CaseCard";
import { Button } from "@/components/ui/Button";

const TABS = ["All", "Pending", "In Progress", "Resolved"];

export default function CasesScreen() {
  const router = useRouter();
  const { cases } = useCasesStore();
  const [activeTab, setActiveTab] = useState("All");

  const filteredCases = cases.filter((c) => {
    if (activeTab === "All") return true;
    return c.status.replace("_", " ").toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex flex-col pb-6 md:px-6 lg:px-10 max-w-7xl mx-auto w-full">
      <div className="px-4 md:px-0 pt-4 md:pt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <p className="text-[13px] md:text-[14px] text-[var(--color-text-muted)]">
          My Reports
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto gap-2 px-4 md:px-0 pt-3 pb-4 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-[var(--color-accent)] text-[#0F1117] font-semibold"
                : "bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cases List */}
      <div className="px-4 md:px-0 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 mt-2">
        {filteredCases.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center px-8 md:col-span-full">
            <ClipboardList className="w-16 h-16 text-[var(--color-border)] mx-auto mb-4" />
            <h2 className="font-display font-semibold text-[20px] md:text-[24px]">
              No reports yet
            </h2>
            <p className="font-body text-[14px] md:text-[16px] text-[var(--color-text-secondary)] mt-2">
              Start by reporting a fault in your area.
            </p>
            <Link
              href="/report"
              className="mt-8 w-full max-w-[200px] md:max-w-[240px]"
            >
              <Button
                size="lg"
                className="w-full shadow-[var(--shadow-button)]"
              >
                Report a Fault &rarr;
              </Button>
            </Link>
          </div>
        ) : (
          filteredCases.map((report) => (
            <CaseCard key={report.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
}
