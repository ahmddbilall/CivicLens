"use client";

import { useState } from "react";
import { CaseCard } from "@/components/features/cases/CaseCard";
import { Report } from "@/types";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dummy cases for the explore page
const exploreCases: Report[] = [
  {
    id: "CL-9821",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
    faultType: "garbage",
    severity: "high",
    description: "Huge pile of uncollected garbage blocking the sidewalk.",
    location: { address: "Main Boulevard, Gulberg III", city: "Lahore", lat: 0, lng: 0 },
    authority: { name: "LWMC", department: "Sanitation", email: "", phone: "", hours: "" },
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    followUpAt: "",
    duplicateCount: 12,
    emailSent: true,
    socialPostPublished: true,
    timeline: []
  },
  {
    id: "CL-9820",
    photoUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=400",
    faultType: "road_damage",
    severity: "medium",
    description: "Deep pothole causing traffic slowdowns.",
    location: { address: "Ferozepur Road", city: "Lahore", lat: 0, lng: 0 },
    authority: { name: "LDA", department: "Roads", email: "", phone: "", hours: "" },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    followUpAt: "",
    duplicateCount: 5,
    emailSent: true,
    socialPostPublished: false,
    timeline: []
  },
  {
    id: "CL-9819",
    photoUrl: "https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=400",
    faultType: "broken_light",
    severity: "low",
    description: "Street light has been out for 3 days.",
    location: { address: "DHA Phase 5", city: "Lahore", lat: 0, lng: 0 },
    authority: { name: "LESCO", department: "Maintenance", email: "", phone: "", hours: "" },
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    followUpAt: "",
    duplicateCount: 2,
    emailSent: true,
    socialPostPublished: false,
    timeline: []
  }
];

export default function ExploreScreen() {
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

      {/* Grid Layout for Desktop, List for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exploreCases
          .filter(report => {
            if (activeFilter === "all" || activeFilter === "nearby") return true;
            return report.status === activeFilter;
          })
          .map((report) => (
            <CaseCard key={report.id} report={report} />
          ))}
      </div>
    </div>
  );
}
