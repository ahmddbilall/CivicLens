import { cn } from "@/lib/utils";

export type StatusType = "pending" | "in_progress" | "resolved" | "escalated";

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  const styles = {
    pending: "bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)] border-opacity-40",
    in_progress: "bg-[#3B82F615] text-[#3B82F6] border-[#3B82F6] border-opacity-40",
    resolved: "bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)] border-opacity-40",
    escalated: "bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)] border-opacity-40",
  };

  const labels = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
    escalated: "Escalated",
  };

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium border border-opacity-40",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
