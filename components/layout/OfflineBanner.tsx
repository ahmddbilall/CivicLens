"use client";

import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOfflineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -32 }}
          animate={{ y: 0 }}
          exit={{ y: -32 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[var(--color-danger)] py-2 px-4 text-center text-xs text-white"
        >
          📡 No connection — reports are being queued
        </motion.div>
      )}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -32 }}
          animate={{ y: 0 }}
          exit={{ y: -32 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[var(--color-success)] py-2 px-4 text-center text-xs text-white"
        >
          ✓ Back online
        </motion.div>
      )}
    </AnimatePresence>
  );
}
