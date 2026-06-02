"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  if (pathname.startsWith("/profile")) {
    return null;
  }

  if (pathname === "/home") {
    const firstName = user?.name ? user.name.split(" ")[0] : "Citizen";
    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "CL";
    return (
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-bg-elevated rounded-full flex items-center justify-center font-bold text-sm border border-border shadow-(--shadow-card) overflow-hidden">
            <span className="text-accent">{initials}</span>
          </div>
          <span className="text-base font-medium">Hi, {firstName}</span>
        </div>
      </div>
    );
  }

  if (pathname.startsWith("/report")) {
    if (
      pathname === "/report/preview" ||
      pathname === "/report/processing" ||
      pathname === "/report/success"
    ) {
      // Preview handles its own overlay topbar, processing has none/progress, success has none
      return null;
    }
    const title =
      pathname === "/report/review" ? "Review Your Report" : "Report a Fault";
    return (
      <div className="px-5 pt-4 pb-2 flex items-center">
        <button
          onClick={() => router.back()}
          className="text-text-secondary mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-semibold text-[18px] flex-1 text-center pr-10">
          {title}
        </h1>
      </div>
    );
  }

  if (pathname === "/cases") {
    return (
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-display font-semibold text-[20px]">My Reports</h1>
      </div>
    );
  }

  if (pathname.startsWith("/cases/")) {
    // We'll let the page itself handle the top bar because it needs the case ID and status
    // which aren't readily available to the global TopBar without state.
    return null;
  }

  if (pathname === "/notifications") {
    return null;
  }

  return null;
}
