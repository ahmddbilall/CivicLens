"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReportStore } from "@/store/useReportStore";
import { Button } from "@/components/ui/Button";

export default function PreviewScreen() {
  const router = useRouter();
  const { draft } = useReportStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!draft.photoUrl) {
      router.replace("/report");
    }
  }, [draft.photoUrl, router]);

  const [description, setDescription] = useState(draft.description || "");
  const { setDraft } = useReportStore();

  if (!mounted || !draft.photoUrl) return null;

  const handleNext = () => {
    setDraft({ description });
    router.push("/report/processing");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center md:bg-black/95 md:backdrop-blur-sm">
      <div className="relative w-full h-full md:max-w-md md:h-[800px] md:max-h-[90vh] md:rounded-[32px] md:overflow-hidden md:border md:border-white/10 md:shadow-2xl flex flex-col bg-black">
        {/* Top Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-[calc(env(safe-area-inset-top)+16px)] md:pt-6 flex justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white font-medium hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Retake
          </button>
        </div>

        {/* Full Screen Image */}
        <img
          src={draft.photoUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />

        {/* Bottom Overlay Card */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            delay: 0.1,
          }}
          className="absolute bottom-0 left-0 right-0 bg-[#161D2F]/95 backdrop-blur-lg md:rounded-b-[32px] rounded-t-[24px] pt-2 pb-[calc(env(safe-area-inset-bottom)+32px)] md:pb-8 px-6"
        >
          <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-5 md:hidden" />

          <h2 className="font-display font-semibold text-[22px] text-white mt-1">
            Looks good?
          </h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 mb-4">
            Add a short description about this fault (English, Urdu, or Roman
            Urdu).
          </p>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., Deep pothole near the main intersection..."
            className="w-full h-24 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 text-[14px] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none mb-2"
          />

          <div className="mt-4">
            <Button
              size="lg"
              className="w-full shadow-[var(--shadow-button)]"
              onClick={handleNext}
              disabled={description.trim().length < 5}
            >
              Analyze with AI &rarr;
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
