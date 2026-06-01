"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  PlusCircle,
  ClipboardList,
  UserCircle,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/welcome" ||
    pathname === "/signup" ||
    pathname === "/verify" ||
    pathname === "/setup" ||
    pathname.startsWith("/report/")
  ) {
    return null;
  }

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Explore", href: "/explore", icon: ClipboardList },
    { name: "Alerts", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[100dvh] fixed left-0 top-0 bg-[var(--color-bg-base)] border-r border-[var(--color-border)] px-4 py-8 z-40">
      <div className="mb-12 px-2">
        <Link
          href="/"
          className="inline-flex items-center font-display font-bold text-[24px] text-white hover:text-[var(--color-accent)] transition-colors cursor-pointer"
        >
          CivicLens
        </Link>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors relative",
                isActive
                  ? "bg-[var(--color-bg-surface)] text-[var(--color-accent)]"
                  : "hover:bg-[var(--color-bg-surface)] hover:text-white text-[var(--color-text-secondary)]",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-[15px]">{tab.name}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-accent)] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href="/report"
          className="flex items-center justify-center gap-2 w-full bg-[var(--color-accent)] text-[#0F1117] py-4 rounded-xl font-bold shadow-[var(--shadow-button)] hover:brightness-110 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Report Fault
        </Link>
      </div>
    </aside>
  );
}
