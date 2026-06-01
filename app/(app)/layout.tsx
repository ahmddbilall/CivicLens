"use client";

import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar =
    pathname === "/" ||
    pathname === "/welcome" ||
    pathname === "/signup" ||
    pathname === "/verify" ||
    pathname === "/setup" ||
    pathname.startsWith("/report/");

  return (
    <div className="min-h-screen flex bg-bg-base text-text-primary relative app-shell">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col w-full relative min-h-screen ${hideSidebar ? "md:ml-0" : "md:ml-64"}`}
      >
        <OfflineBanner />
        <TopBar />
        <main className="flex-1 w-full relative pb-20 md:pb-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
