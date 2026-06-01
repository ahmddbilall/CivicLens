"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col h-full justify-center px-6 pb-8 pt-12 overflow-hidden w-full max-w-md mx-auto">
      {/* Hero Area */}
      <div className="flex-[0.55] relative flex items-center justify-center min-h-[300px]">
        {/* Smartphone Illustration */}
        <div className="relative w-48 h-96 border-4 border-[var(--color-border)] rounded-[40px] flex items-center justify-center bg-[var(--color-bg-surface)] overflow-hidden">
          <div className="absolute top-2 w-16 h-1.5 bg-[var(--color-border)] rounded-full"></div>
          <Camera className="w-16 h-16 text-[var(--color-text-secondary)] opacity-30" />
        </div>

        {/* Floating Cards */}
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -left-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs shadow-lg"
        >
          🔍 Fault detected
        </motion.div>

        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -right-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs shadow-lg"
        >
          ✉️ Complaint drafted
        </motion.div>

        <motion.div
          animate={{ y: [5, -15, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 left-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs shadow-lg"
        >
          📋 Case #CL-2847
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-[0.45] flex flex-col justify-end mt-8 z-10">
        <h1 className="font-display font-bold text-[28px] text-white leading-tight">
          From photo to filed complaint —<br />
          in under 60 seconds.
        </h1>
        
        <div className="flex flex-wrap gap-2 mt-5">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-full px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
            📸 Snap a fault
          </div>
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-full px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
            🤖 AI handles it
          </div>
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-full px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
            ✅ Tracked
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Link href="/signup" className="w-full">
            <Button size="lg" className="w-full shadow-[var(--shadow-button)]">
              Get Started
            </Button>
          </Link>
          <Link href="/login" className="text-sm text-[var(--color-text-secondary)] text-center pb-2">
            Already have an account? <span className="underline hover:text-white">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
