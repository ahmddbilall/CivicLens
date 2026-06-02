"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AgentPipeline } from "@/components/features/report/AgentPipeline";
import { useReportStore } from "@/store/useReportStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

export default function ProcessingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { draft, setDraft } = useReportStore();
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!draft.photoUrl) {
      router.replace("/report");
    }
  }, [draft.photoUrl, router]);

  const handleComplete = () => {
    setIsComplete(true);
    // Populate mock agent data to draft
    setDraft({
      faultType: "road_damage", // Selected by AI
      severity: "high",
      description: draft.description || "Deep pothole with surface cracking detected",
      location: {
        lat: 31.5204,
        lng: 74.3587,
        address: user?.street || "Unknown Street",
        city: user?.city || "Unknown City",
      },
      authority: {
        name: "WASA",
        department: "Water and Sanitation Agency",
        email: "complaints@wasa.gop.pk",
        phone: "+92 42 99262241",
        hours: "9 AM - 5 PM",
      },
    });
  };

  if (!mounted || !draft.photoUrl) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen h-full justify-center items-center bg-[var(--color-bg-base)] px-5 pt-6 pb-8 relative w-full max-w-md mx-auto">
      {/* Progress Bar (absolute top) */}
      <div className="fixed md:absolute top-0 left-0 right-0 h-1 bg-[var(--color-border)] z-50">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="h-full bg-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col items-center text-center mt-2 md:mt-0 mb-6 w-full">
        <img
          src={draft.photoUrl}
          alt="Thumbnail"
          className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl object-cover border-2 border-[var(--color-border)] shadow-lg"
        />
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] text-center mt-3 font-medium">
          Analyzing your report...
        </p>
      </div>

      <div className="w-full">
        <AgentPipeline onComplete={handleComplete} />
      </div>

      {/* Bottom CTA Slides up */}
      {isComplete && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-[var(--color-bg-base)]/90 backdrop-blur border-t border-[var(--color-border)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 z-40 md:rounded-t-3xl md:border-l md:border-r"
        >
          <Button
            size="lg"
            className="w-full shadow-[var(--shadow-button)]"
            onClick={() => router.push("/report/review")}
          >
            Review &amp; Send &rarr;
          </Button>
        </motion.div>
      )}
    </div>
  );
}
