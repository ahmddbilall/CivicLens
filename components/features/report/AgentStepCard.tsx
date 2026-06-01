"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { AgentStep } from "@/types";

interface AgentStepCardProps {
  step: AgentStep;
  index: number;
}

export function AgentStepCard({ step, index }: AgentStepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.8 }}
      className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
    >
      {step.status === "processing" && (
        <motion.div
          className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-2xl z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
        style={{ backgroundColor: `${step.color}15`, color: step.color }}
      >
        <span dangerouslySetInnerHTML={{ __html: step.icon }} />
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="font-semibold text-[14px]">{step.name}</h3>
        {(step.result || step.detail) && (
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
            {step.result && <span className="font-medium text-white">{step.result}</span>}
            {step.result && step.detail && " · "}
            {step.detail}
          </p>
        )}
      </div>

      <div className="w-5 h-5 shrink-0 relative z-10">
        {step.status === "processing" && (
          <Loader2 className="w-5 h-5 text-[var(--color-accent)] animate-spin" />
        )}
        {step.status === "complete" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Check className="w-5 h-5 text-[var(--color-success)]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
