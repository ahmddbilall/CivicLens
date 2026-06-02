"use client";

import { useState } from "react";
import { CaseCard } from "@/components/features/cases/CaseCard";
import { Report } from "@/types";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { useCasesStore } from "@/store/useCasesStore";

export default function ExploreScreen() {
  const { cases } = useCasesStore();
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+80px)] md:pb-8 w-full max-w-5xl mx-auto md:pt-10">
      
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[24px] md:text-[28px] mb-2">Explore Cases</h1>
        <p className="text-[14px] md:text-[16px] text-[var(--color-text-secondary)]">
          Discover and track civic issues reported by the community.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            placeholder="Search by ID, location, or fault type..." 
            className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
          <Button 
            variant={activeFilter === "all" ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="rounded-full px-4"
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "nearby" ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setActiveFilter("nearby")}
            className="rounded-full px-4 flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" /> Nearby
          </Button>
          <Button 
            variant={activeFilter === "pending" ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setActiveFilter("pending")}
            className="rounded-full px-4"
          >
            Pending
          </Button>
          <Button 
            variant={activeFilter === "resolved" ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setActiveFilter("resolved")}
            className="rounded-full px-4"
          >
            Resolved
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="rounded-full px-3 border-dashed border-[var(--color-border)]"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="mt-16 flex flex-col items-center px-8 text-center">
          <div className="w-24 h-24 mb-6 text-[var(--color-border)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10v12M20 10v12M4 10l8-8 8 8M10 22v-6h4v6" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-[20px] md:text-[24px]">No reports yet.</h2>
          <p className="font-body text-[14px] md:text-[16px] text-[var(--color-text-secondary)] mt-2 max-w-md">
            Check back later to discover and track civic issues reported by the community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases
            .filter(report => {
              if (activeFilter === "all" || activeFilter === "nearby") return true;
              return report.status === activeFilter;
            })
            .map((report) => (
              <CaseCard key={report.id} report={report} />
            ))}
        </div>
      )}
    </div>
  );
}
