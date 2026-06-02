"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useCasesStore } from "@/store/useCasesStore";
import { useReportStore } from "@/store/useReportStore";
import { FaultSeverity, FaultType, Report } from "@/types";

export default function SuccessScreen() {
  const router = useRouter();
  const { addCase } = useCasesStore();
  const { draft, resetDraft } = useReportStore();

  const [caseId] = useState(
    () => "CL-" + Math.floor(1000 + Math.random() * 9000),
  );
  const [realCaseId, setRealCaseId] = useState<string | null>(null);

  useEffect(() => {
    if (draft.photoUrl) {
      const newReport: Partial<Report> = {
        id: caseId,
        photoUrl: draft.photoUrl,
        faultType: (draft.faultType as FaultType) || "road_damage",
        severity: (draft.severity as FaultSeverity) || "high",
        description: draft.description || "Reported issue",
        location: draft.location || {
          lat: 0,
          lng: 0,
          address: "Unknown location",
          city: "Unknown",
        },
        authority: draft.authority || {
          name: "Local Authority",
          department: "",
          email: "",
          phone: "",
          hours: "",
        },
        status: "pending",
        createdAt: new Date().toISOString(),
        followUpAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        duplicateCount: 0,
        emailSent: draft.sendEmail || false,
        socialPostPublished: draft.postSocial || false,
        timeline: [
          {
            id: Date.now().toString(),
            type: "filed",
            label: "Report Filed",
            date: new Date().toISOString(),
          },
        ],
      };

      const submit = async () => {
        const id = await addCase(newReport);
        if (id) {
          setRealCaseId(id);
        }
      };
      submit();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  const handleDone = () => {
    resetDraft();
    if (realCaseId) {
      router.push(`/cases/${realCaseId}`);
    } else {
      router.push("/cases");
    }
  };

  const handleHome = () => {
    resetDraft();
    router.push("/home");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `CivicLens Case #${caseId}`,
          text: `I just reported an issue in my city. Case ID: #${caseId}. Let&apos;s hold them accountable!`,
          url: window.location.origin,
        })
        .catch(console.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-6 w-full max-w-xl mx-auto py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 bg-success-muted border-2 border-success rounded-full flex items-center justify-center mx-auto"
      >
        <svg
          className="w-12 h-12 text-success"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            d="M20 6L9 17l-5-5"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display font-bold text-[32px] text-white mt-6 text-center"
      >
        Report Filed.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[16px] text-text-secondary mt-2 text-center"
      >
        You&apos;ve held your city accountable.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="mt-6 bg-bg-surface rounded-xl px-8 py-4 border border-border text-center w-full max-w-sm shadow-(--shadow-card)"
      >
        <p className="font-mono text-[28px] text-accent font-medium">
          #{caseId}
        </p>
        <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider">
          Your Case ID
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-2 mt-5 flex-wrap justify-center"
      >
        <div className="bg-success-muted border border-success border-opacity-30 rounded-full px-3 py-1.5 text-xs text-success">
          ✓ Post published
        </div>
        <div className="bg-success-muted border border-success border-opacity-30 rounded-full px-3 py-1.5 text-xs text-success">
          ✓ Tracking active
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-accent-muted border border-accent border-opacity-30 rounded-xl px-4 py-3 w-full max-w-sm"
      >
        <p className="text-sm text-accent">
          🔔 We'll remind you in 7 days if this fault remains unresolved.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-5 text-center flex items-center justify-center gap-2"
      >
        <span className="text-sm text-text-secondary">
          Share case ID so neighbors can co-sign &rarr;
        </span>
        <button
          onClick={handleShare}
          className="text-sm text-accent font-medium bg-accent-muted px-3 py-1.5 rounded-full hover:bg-accent hover:text-bg-base transition-colors cursor-pointer"
        >
          Share
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 flex flex-col gap-3 w-full max-w-sm"
      >
        <Button
          size="lg"
          className="w-full shadow-(--shadow-button)"
          onClick={handleDone}
        >
          View Case Details &rarr;
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => {
            resetDraft();
            router.push("/report");
          }}
        >
          Report Another Fault
        </Button>
        <button
          onClick={handleHome}
          className="text-[14px] text-text-muted text-center mt-2 underline hover:text-text-secondary cursor-pointer"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
