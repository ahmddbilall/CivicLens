"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, PlusCircle, ClipboardList, UserCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on certain screens (like splash, auth, report sub-screens)
  if (
    pathname === "/" ||
    pathname === "/welcome" ||
    pathname === "/signup" ||
    pathname === "/verify" ||
    pathname === "/setup" ||
    pathname.startsWith("/report/") ||
    pathname.startsWith("/cases/")
  ) {
    return null;
  }

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Explore", href: "/explore", icon: ClipboardList },
    { name: "Report", href: "/report", icon: PlusCircle, isCenter: true },
    { name: "Alerts", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-base)] border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <Link key={tab.name} href={tab.href} className="relative -top-4 flex flex-col items-center">
                <div className="w-14 h-14 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-[var(--shadow-button)]">
                  <Icon className="w-7 h-7 text-[var(--color-bg-base)]" />
                </div>
                <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]")}>
                  {tab.name}
                </span>
                {isActive && (
                  <motion.div layoutId="navIndicator" className="w-1 h-1 bg-[var(--color-accent)] rounded-full mt-0.5" />
                )}
              </Link>
            );
          }

          return (
            <Link key={tab.name} href={tab.href} className="flex flex-col items-center justify-center w-16">
              <Icon className={cn("w-6 h-6", isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]")} />
              <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]")}>
                {tab.name}
              </span>
              {isActive && (
                <motion.div layoutId="navIndicator" className="w-1 h-1 bg-[var(--color-accent)] rounded-full mt-0.5 absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
