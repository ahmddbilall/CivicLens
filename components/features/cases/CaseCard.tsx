import Link from "next/link";
import { Report } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export function CaseCard({ report }: { report: Report }) {
  const caseLabel = report.displayId || `CL-${report.id.slice(-4).toUpperCase()}`;

  const getFaultBadgeColor = (type: string) => {
    switch (type) {
      case "road_damage":
        return "bg-[#F5A623] text-[#0F1117]";
      case "garbage":
        return "bg-[#10B981] text-[#0F1117]";
      case "broken_light":
        return "bg-[#3B82F6] text-white";
      case "infrastructure":
        return "bg-[#8B5CF6] text-white";
      default:
        return "bg-[var(--color-bg-elevated)] text-white border border-[var(--color-border)]";
    }
  };

  const getFaultName = (type: string) => {
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Link
      href={`/cases/${report.id}`}
      className="bg-bg-surface rounded-3xl border border-border p-4 md:p-5 flex flex-col gap-4 active:scale-[0.98] transition-transform hover:border-accent/50 cursor-pointer w-full min-w-0 overflow-hidden"
    >
      <div className="w-full aspect-16/10 rounded-2xl shrink-0 overflow-hidden bg-bg-elevated shadow-sm">
        {report.photoUrl ? (
          <img
            src={report.photoUrl}
            alt="Fault"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] md:text-xs text-text-muted">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <span
            className={`max-w-[70%] rounded-full px-3 py-1 text-[11px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis ${getFaultBadgeColor(report.faultType)}`}
          >
            {getFaultName(report.faultType)}
          </span>
          <div className="shrink-0">
            <StatusBadge status={report.status} />
          </div>
        </div>

        <p className="text-base md:text-lg text-white mt-3 font-medium wrap-break-word leading-snug">
          {report.location.address}
        </p>

        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 min-w-0">
          <span className="font-mono text-[13px] md:text-sm text-text-muted">
            #{caseLabel}
          </span>
          <span className="text-border hidden sm:inline">•</span>
          <span className="text-[13px] md:text-sm text-text-muted wrap-break-word">
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
