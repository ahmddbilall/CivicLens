"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push("/home");
      } else {
        router.push("/welcome");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-4 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.5 0h1v60h-1V0zM0 29.5h60v1H0v-1z' fill='%23FFFFFF' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />
      
      <motion.h1 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display font-bold text-[36px] text-white"
      >
        CivicLens
      </motion.h1>
      
      <div className="flex items-center gap-2 mt-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-[14px] text-[var(--color-text-secondary)]"
        >
          Your city. Your voice. On record.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse"
        />
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="w-1/3 h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-[var(--color-accent)]"
          />
        </div>
      </div>
    </div>
  );
}
