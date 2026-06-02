"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Check, Mail, MessageSquare } from "lucide-react";
import { useCasesStore } from "@/store/useCasesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CaseTimeline } from "@/components/features/cases/CaseTimeline";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function CaseDetailScreen() {
  const { id } = useParams();
  const router = useRouter();
  const { cases, resolveCase, deleteCase } = useCasesStore();
  const { user } = useAuthStore();
  
  const report = cases.find(c => c.id === id);
  const isOwner = report?.userId === user?.id;
  
  const [authorityOpen, setAuthorityOpen] = useState(false);
  const [resolveSheetOpen, setResolveSheetOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  if (!report) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Case not found</div>;
  }

  const caseLabel = report.displayId || `CL-${report.id.slice(-4).toUpperCase()}`;
  const caseTitle = `${report.faultType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")} Report`;
  const officeMapsQuery =
    report.authority.officeLocation?.lat && report.authority.officeLocation?.lng
      ? `${report.authority.officeLocation.lat},${report.authority.officeLocation.lng}`
      : report.authority.officeAddress || report.authority.name;
  const officeMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeMapsQuery)}`;

  const handleResolve = () => {
    resolveCase(report.id);
    setResolveSheetOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this case? This cannot be undone.")) {
      await deleteCase(report.id);
      router.push("/cases");
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] pb-56 lg:pb-32">
      {/* Custom Top Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between sticky top-0 bg-[var(--color-bg-base)]/80 backdrop-blur z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[var(--color-text-secondary)]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <p className="font-display font-semibold text-[15px] leading-tight truncate">
              {caseTitle}
            </p>
            <p className="font-mono text-[11px] text-[var(--color-text-muted)] mt-0.5">
              #{caseLabel}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {/* Desktop Wrapper */}
      <div className="flex flex-col lg:flex-row gap-6 md:px-6 lg:px-10 max-w-7xl mx-auto w-full mt-4">
        {/* Left Column */}
        <div className="flex-[0.6] flex flex-col gap-4 md:gap-6">
          {/* Hero Image */}
          <div className="relative w-full h-52 md:h-80 bg-[var(--color-bg-elevated)] md:rounded-2xl overflow-hidden">
            <img src={report.photoUrl} alt="Fault" className="w-full h-full object-cover" />
            {report.severity === "high" && (
              <div className="absolute bottom-3 left-3 bg-[var(--color-danger)] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider">
                HIGH SEVERITY
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="mx-4 md:mx-0 bg-[var(--color-bg-surface)] md:rounded-2xl md:p-6 md:border md:border-[var(--color-border)]">
            <h3 className="hidden md:block font-display font-semibold text-[18px] mb-6">Activity Timeline</h3>
            <CaseTimeline events={report.timeline} status={report.status} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-[0.4] flex flex-col gap-4 md:gap-6">
          {/* Fault Info Card */}
          <div className="mx-4 md:mx-0 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[var(--color-accent)] text-[#0F1117] rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                {report.faultType.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[14px] md:text-[15px] text-white leading-relaxed">{report.description}</p>
            
            <div className="mt-5 pt-5 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] md:text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">Reported On</p>
                <p className="text-[13px] md:text-[14px] text-white mt-1 font-medium">{report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : "Unknown"}</p>
              </div>
              <div>
                <p className="text-[11px] md:text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">Auto Follow-up</p>
                <p className="text-[13px] md:text-[14px] text-white mt-1 font-medium">{report.followUpAt ? format(new Date(report.followUpAt), "MMM d, yyyy") : "Pending"}</p>
              </div>
            </div>
          </div>

          {/* Authority Info Card */}
          <div className="mx-4 md:mx-0 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            <button 
              onClick={() => setAuthorityOpen(!authorityOpen)}
              className="w-full p-4 md:p-6 flex justify-between items-center transition-colors hover:bg-[var(--color-bg-elevated)]"
            >
              <div className="text-left">
                <h3 className="font-display font-semibold text-[15px] md:text-[16px]">
                  {report.authority.officeName || report.authority.name}
                </h3>
                <p className="text-[13px] md:text-[14px] text-[var(--color-text-secondary)] mt-1">
                  {report.authority.department || report.authority.name}
                </p>
              </div>
              {authorityOpen ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-text-muted)]" />}
            </button>
            
            <AnimatePresence>
              {authorityOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 md:px-6 pb-4 md:pb-6 border-t border-[var(--color-border)]"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    {report.authority.officeAddress && (
                      <p className="text-[13px] md:text-[14px] text-white leading-relaxed">
                        {report.authority.officeAddress}
                      </p>
                    )}
                    {report.authority.distanceKm !== undefined && (
                      <p className="text-[12px] md:text-[13px] text-[var(--color-text-muted)]">
                        Nearest office: about {report.authority.distanceKm} km away
                      </p>
                    )}
                    <p className="font-mono text-[13px] md:text-[14px] text-[var(--color-accent)]">
                      {report.authority.email || "Email not found"}
                    </p>
                    <p className="text-[13px] md:text-[14px] text-[var(--color-text-secondary)]">
                      {report.authority.phone || "Phone not found"}
                    </p>
                    <p className="text-[12px] md:text-[13px] text-[var(--color-text-muted)]">
                      Hours: {report.authority.hours || "Not listed"}
                    </p>
                    {report.authority.sourceUrl && (
                      <a
                        href={report.authority.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] md:text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        Source
                      </a>
                    )}
                    <a
                      href={officeMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[13px] md:text-[14px] text-[var(--color-accent)] font-medium mt-2 inline-flex self-start hover:underline"
                    >
                      Get Directions &rarr;
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

      {/* Desktop Inline CTA */}
      <div className="hidden lg:block mt-2">
        {isOwner && (
          <>
            {report.status !== "resolved" ? (
              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full shadow-[var(--shadow-button)] cursor-pointer" onClick={() => setResolveSheetOpen(true)}>
                  Mark as Resolved ✓
                </Button>
                <Button size="lg" variant="secondary" className="w-full cursor-pointer" onClick={() => setFollowUpOpen(true)}>
                  Send Follow-up
                </Button>
              </div>
            ) : (
              <div className="bg-[var(--color-success-muted)] border border-[var(--color-success)] border-opacity-30 rounded-xl px-4 py-4 flex justify-center items-center gap-2 shadow-sm">
                <span className="text-[var(--color-success)] font-medium">✓ Resolved — Thank you for reporting!</span>
              </div>
            )}
            <Button size="lg" variant="secondary" className="w-full mt-3 border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-colors cursor-pointer" onClick={handleDelete}>
              Delete Case
            </Button>
          </>
        )}
      </div>
    </div>
  </div>

  {/* Fixed Bottom CTA for Mobile */}
  <div className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[45vh] overflow-y-auto bg-[var(--color-bg-base)]/95 backdrop-blur border-t border-[var(--color-border)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40">
    {isOwner ? (
      <>
        {report.status !== "resolved" ? (
          <>
            <Button size="lg" className="w-full shadow-[var(--shadow-button)] mb-2 cursor-pointer" onClick={() => setResolveSheetOpen(true)}>
              Mark as Resolved ✓
            </Button>
            <Button size="lg" variant="secondary" className="w-full cursor-pointer" onClick={() => setFollowUpOpen(true)}>
              Send Follow-up
            </Button>
          </>
        ) : (
          <div className="bg-[var(--color-success-muted)] border border-[var(--color-success)] border-opacity-30 rounded-xl px-4 py-3 flex justify-center items-center gap-2">
            <span className="text-[var(--color-success)] font-medium">✓ Resolved — Thank you for reporting!</span>
          </div>
        )}
        <Button size="lg" variant="secondary" className="w-full mt-2 border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-colors cursor-pointer" onClick={handleDelete}>
          Delete Case
        </Button>
      </>
    ) : (
      <div className="bg-[var(--color-bg-elevated)] rounded-xl px-4 py-3 flex justify-center items-center">
        <span className="text-[var(--color-text-secondary)] font-medium text-sm">Case reported by a community member</span>
      </div>
    )}
  </div>

  {/* Resolve Confirmation Sheet */}
  <BottomSheet open={resolveSheetOpen} onOpenChange={setResolveSheetOpen}>
    <div className="flex flex-col items-center text-center pt-2">
      <div className="w-16 h-16 bg-[var(--color-success-muted)] rounded-full flex items-center justify-center mb-4">
        <Check className="w-8 h-8 text-[var(--color-success)]" />
      </div>
      <h2 className="font-display font-semibold text-[20px] mb-2">Are you sure?</h2>
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-8">
        Confirming this tells us the issue has been fixed. This helps track resolution rates.
      </p>
      
      <Button size="lg" className="w-full bg-[var(--color-success)] text-white hover:bg-green-600 mb-3 cursor-pointer" onClick={handleResolve}>
        Yes, it&apos;s fixed ✓
      </Button>
      <Button size="lg" variant="ghost" className="w-full cursor-pointer" onClick={() => setResolveSheetOpen(false)}>
        Not yet
      </Button>
    </div>
  </BottomSheet>

  {/* Follow-up Sheet */}
  <BottomSheet open={followUpOpen} onOpenChange={setFollowUpOpen}>
    <h2 className="font-display font-semibold text-[20px] mb-4">Send Follow-up</h2>
    <p className="text-[14px] text-[var(--color-text-secondary)] mb-4">
      Below are escalated drafts you can copy and send directly.
    </p>

    <div className="flex flex-col gap-4">
      <div className="bg-[var(--color-bg-base)] rounded-xl border border-[var(--color-border)] p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold text-[14px]">Urgent Email</span>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] whitespace-pre-wrap">
          {`URGENT: SECOND NOTICE to ${report.authority.name},\n\nThis is an escalated follow-up regarding the ${report.faultType.replace('_', ' ')} at ${report.location.address}. This was reported on ${format(new Date(report.createdAt), "MMM d, yyyy")} and no action has been taken.\n\nDescription: ${report.description}.\n\nThis delay is unacceptable and poses a hazard. I expect immediate acknowledgement and a timeline for resolution.\n\nSincerely,\nConcerned Citizen`}
        </p>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`URGENT: SECOND NOTICE to ${report.authority.name},\n\nThis is an escalated follow-up regarding the ${report.faultType.replace('_', ' ')} at ${report.location.address}. This was reported on ${format(new Date(report.createdAt), "MMM d, yyyy")} and no action has been taken.\n\nDescription: ${report.description}.\n\nThis delay is unacceptable and poses a hazard. I expect immediate acknowledgement and a timeline for resolution.\n\nSincerely,\nConcerned Citizen`);
            setCopiedEmail(true); setTimeout(() => setCopiedEmail(false), 2000);
          }}
          className="mt-3 bg-[var(--color-bg-elevated)] hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] transition-colors flex items-center gap-2 text-[12px] font-medium cursor-pointer"
        >
          {copiedEmail ? "Copied!" : "Copy Email"}
        </button>
      </div>

      <div className="bg-[var(--color-bg-base)] rounded-xl border border-[var(--color-border)] p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold text-[14px]">Urgent Social Post</span>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] whitespace-pre-wrap">
          {`STILL WAITING! 😡 The ${report.faultType.replace('_', ' ')} at ${report.location.address} is still not fixed after several days! @${report.authority.name.replace(/ /g, '')} why is this being ignored? Everyone please RT to demand action NOW! ⚠️ #CivicLens #FixOurCity`}
        </p>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`STILL WAITING! 😡 The ${report.faultType.replace('_', ' ')} at ${report.location.address} is still not fixed after several days! @${report.authority.name.replace(/ /g, '')} why is this being ignored? Everyone please RT to demand action NOW! ⚠️ #CivicLens #FixOurCity`);
            setCopiedSocial(true); setTimeout(() => setCopiedSocial(false), 2000);
          }}
          className="mt-3 bg-[var(--color-bg-elevated)] hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] transition-colors flex items-center gap-2 text-[12px] font-medium cursor-pointer"
        >
          {copiedSocial ? "Copied!" : "Copy Post"}
        </button>
      </div>
    </div>
  </BottomSheet>
</div>
  );
}
