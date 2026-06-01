import { TimelineEvent, CaseStatus } from "@/types";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaseTimeline({ events, status }: { events: TimelineEvent[], status: CaseStatus }) {
  // Determine all steps based on current status
  // Filed -> Email Sent -> Follow Up -> Resolved
  
  const steps = [
    { type: "filed", label: "Report Filed" },
    { type: "email_sent", label: "Email Sent to Authority" },
    { type: "follow_up_sent", label: "Awaiting Resolution", pendingLabel: "Awaiting Resolution" },
    { type: "resolved", label: "Marked as Resolved", futureLabel: "Mark as Resolved" }
  ];

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-4">
      <h3 className="font-display text-[15px] mb-4">Timeline</h3>
      <div className="flex flex-col">
        {steps.map((step, index) => {
          const event = events.find(e => e.type === step.type);
          const isCompleted = !!event;
          
          let isActive = false;
          if (step.type === "follow_up_sent" && status === "in_progress") isActive = true;
          if (step.type === "resolved" && status === "resolved") isActive = false;

          const isFuture = !isCompleted && !isActive;
          
          let displayLabel = step.label;
          if (isFuture && step.futureLabel) displayLabel = step.futureLabel;
          if (isActive && step.pendingLabel) displayLabel = step.pendingLabel;

          return (
            <div key={step.type} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                {/* Connecting Line */}
                {index !== steps.length - 1 && (
                  <div className={cn(
                    "absolute top-3 bottom-[-1rem] w-[2px]",
                    isCompleted ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
                  )} />
                )}
                
                {/* Dot */}
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 mt-1 ring-4 ring-[var(--color-bg-surface)]",
                  isCompleted ? "bg-[var(--color-success)] text-[var(--color-bg-surface)]" :
                  isActive ? "bg-[var(--color-warning)] animate-pulse" :
                  "bg-[var(--color-border)]"
                )}>
                  {isCompleted && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                </div>
              </div>
              
              <div className="pb-6 pt-0.5">
                <p className={cn(
                  "text-sm",
                  isFuture ? "text-[var(--color-text-muted)]" : "text-white"
                )}>{displayLabel}</p>
                {event && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {format(new Date(event.date), "MMM d, h:mm a")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
