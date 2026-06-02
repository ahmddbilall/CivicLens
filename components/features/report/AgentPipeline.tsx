"use client";

import { useEffect, useRef, useState } from "react";
import { AgentStepCard } from "./AgentStepCard";
import { AgentStep } from "@/types";

const INITIAL_STEPS: AgentStep[] = [
  {
    id: "vision",
    name: "Vision Agent",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    color: "#8B5CF6",
    status: "idle",
  },
  {
    id: "context",
    name: "Context Agent",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    color: "#3B82F6",
    status: "idle",
  },
  {
    id: "authority",
    name: "Authority Lookup",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    color: "#F5A623",
    status: "idle",
  },
  {
    id: "comms",
    name: "Communications Agent",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    color: "#10B981",
    status: "idle",
  },
  {
    id: "tracking",
    name: "Tracking Agent",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`,
    color: "#14B8A6",
    status: "idle",
  },
];

type AgentResult = {
  result: string;
  detail: string;
};

export function AgentPipeline({
  onComplete,
  runStep,
}: {
  onComplete: () => void;
  runStep: (stepId: string) => Promise<AgentResult>;
}) {
  const [steps, setSteps] = useState<AgentStep[]>(INITIAL_STEPS);
  const onCompleteRef = useRef(onComplete);
  const runStepRef = useRef(runStep);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    runStepRef.current = runStep;
  }, [runStep]);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const runPipeline = async () => {
      for (let index = 0; index < INITIAL_STEPS.length; index++) {
        if (cancelled) return;

        setSteps((prev) =>
          prev.map((step, stepIndex) =>
            stepIndex === index ? { ...step, status: "processing" } : step,
          ),
        );

        let result: AgentResult;
        try {
          result = await runStepRef.current(INITIAL_STEPS[index].id);
        } catch (error) {
          result = {
            result: "Agent failed",
            detail:
              error instanceof Error
                ? error.message
                : "Unexpected processing error",
          };
        }

        setSteps((prev) =>
          prev.map((step, stepIndex) =>
            stepIndex === index
              ? { ...step, status: "complete", ...result }
              : step,
          ),
        );

        await sleep(500);
      }

      if (!cancelled) {
        onCompleteRef.current();
      }
    };

    runPipeline();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, idx) => (
        <div key={step.id}>
          {step.status !== "idle" && (
            <AgentStepCard step={step} index={idx} />
          )}
        </div>
      ))}
    </div>
  );
}
