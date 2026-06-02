"use client";

import Link from "next/link";
import { User, Bell, Share2, Globe, Info, Shield, LogOut, ChevronRight, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCasesStore } from "@/store/useCasesStore";
import { useRouter } from "next/navigation";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { cases } = useCasesStore();

  const myCases = cases.filter(c => c.userId === user?.id);
  const totalReports = myCases.length;
  const resolvedCases = myCases.filter(c => c.status === "resolved").length;
  const pendingCases = myCases.filter(c => c.status === "pending").length;

  const handleLogout = () => {
    logout();
    router.push("/welcome");
  };

  return (
    <div className="flex flex-col pb-6 md:max-w-3xl md:mx-auto w-full md:mt-4 md:px-6">
      {/* Profile Header */}
      <div className="bg-[var(--color-bg-surface)] rounded-b-[32px] md:rounded-2xl px-5 pt-12 md:pt-8 pb-8 border-b md:border border-[var(--color-border)] shadow-[var(--shadow-card)]">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[var(--color-accent)] mx-auto overflow-hidden bg-[var(--color-bg-elevated)] flex items-center justify-center relative shadow-lg">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display font-bold text-[24px] md:text-[36px]">{user?.name?.charAt(0) || "U"}</span>
          )}
        </div>
        
        <h2 className="font-display font-semibold text-[20px] md:text-[24px] text-white text-center mt-4 md:mt-5">
          {user?.name || "CivicLens User"}
        </h2>
        <p className="text-[14px] md:text-[16px] text-[var(--color-text-secondary)] text-center mt-0.5 md:mt-1">
          {user?.city || "Unknown City"}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-10 md:gap-16 mt-8 md:mt-10">
          <div className="text-center">
            <p className="font-mono text-[22px] md:text-[28px] text-[var(--color-accent)] font-bold">{totalReports}</p>
            <p className="text-[11px] md:text-[13px] text-[var(--color-text-muted)] mt-1 tracking-wider uppercase font-medium">Reports</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[22px] md:text-[28px] text-[var(--color-accent)] font-bold">{resolvedCases}</p>
            <p className="text-[11px] md:text-[13px] text-[var(--color-text-muted)] mt-1 tracking-wider uppercase font-medium">Resolved</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[22px] md:text-[28px] text-[var(--color-accent)] font-bold">{pendingCases}</p>
            <p className="text-[11px] md:text-[13px] text-[var(--color-text-muted)] mt-1 tracking-wider uppercase font-medium">Pending</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="mx-4 md:mx-0 mt-6 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)] shadow-sm">
        <Link href="/cases" className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">My Reports</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>
        <Link href="/profile/edit" className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <User className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">Personal Information</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>
        
        <Link href="/profile/notifications" className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">Push Notifications</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>
        <Link href="/profile/language" className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">Language & Region</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>

        <Link href="/profile/about" className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <Info className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">About CivicLens</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>

        <Link href="/profile/privacy" className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <div className="flex items-center gap-3 md:gap-4">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-secondary)]" />
            <span className="font-medium text-[15px] md:text-[16px]">Privacy Policy</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </Link>
      </div>

      <div className="mx-4 md:mx-0 mt-4 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <button onClick={handleLogout} className="w-full px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4 hover:bg-[var(--color-bg-elevated)] transition-colors active:scale-[0.98]">
          <LogOut className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-danger)]" />
          <span className="font-medium text-[15px] md:text-[16px] text-[var(--color-danger)]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
