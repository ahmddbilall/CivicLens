"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReportStore } from "@/store/useReportStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCasesStore } from "@/store/useCasesStore";
import { Button } from "@/components/ui/Button";
import {
  Copy,
  Mail,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { FaultSeverity, FaultType, Report } from "@/types";

type Tone = "polite" | "firm" | "urgent";

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .trim();
}

export default function ReviewScreen() {
  const router = useRouter();
  const { draft, resetDraft } = useReportStore();
  const { user } = useAuthStore();
  const { addCase } = useCasesStore();

  const [activeTab, setActiveTab] = useState<"email" | "social">("email");
  const [emailTone, setEmailTone] = useState<Tone>("firm");
  const [socialTone, setSocialTone] = useState<Tone>("urgent");
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!draft.photoUrl) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
        <h1 className="font-display font-semibold text-[24px] text-white">
          No report ready for review
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-2 leading-relaxed">
          Upload a photo and run the AI analysis before opening the review
          screen.
        </p>
        <Button
          size="lg"
          className="mt-8"
          onClick={() => router.replace("/report")}
        >
          Start a Report
        </Button>
      </div>
    );
  }

  const generatedOutreach = draft.generatedOutreach;
  const aiAnalysis = draft.aiAnalysis;

  const fallbackEmails: Record<Tone, string> = {
    polite: `Dear ${draft.authority?.name},\n\nI hope this email finds you well. I am writing to kindly bring to your attention an issue regarding ${draft.faultType?.replace("_", " ")} located at ${draft.location?.address}, ${draft.location?.city}.\n\nThe specific issue is: ${draft.description}.\n\nI would appreciate it if you could look into this when possible. A photo is attached for your reference.\n\nThank you,\n${user?.name || "CivicLens User"}`,
    firm: `To ${draft.authority?.name} Management,\n\nI am writing to formally report a ${draft.faultType?.replace("_", " ")} issue at ${draft.location?.address}, ${draft.location?.city}.\n\nDescription: ${draft.description}.\n\nThis requires attention as it impacts the local residents. Please review the attached photo and provide a timeline for resolution.\n\nRegards,\n${user?.name || "CivicLens User"}`,
    urgent: `URGENT: ${draft.authority?.name} Action Required,\n\nI am reporting a severe hazard regarding ${draft.faultType?.replace("_", " ")} at ${draft.location?.address}, ${draft.location?.city}.\n\nDetails: ${draft.description}.\n\nThis poses an immediate risk to public safety and must be addressed without delay. See attached evidence. Please confirm receipt and immediate action plan.\n\nSincerely,\n${user?.name || "CivicLens User"}`,
  };

  const fallbackSocials: Record<Tone, string> = {
    polite: `I reported a ${draft.faultType?.replace("_", " ")} issue at ${draft.location?.address}. Requesting ${draft.authority?.name} to inspect and resolve it. #CivicLens`,
    firm: `Attention ${draft.authority?.name}: ${draft.location?.address} has a ${draft.faultType?.replace("_", " ")} issue affecting residents. Please act and share a repair timeline. #CivicLens #FixOurCity`,
    urgent: `Urgent civic hazard at ${draft.location?.address}. The ${draft.faultType?.replace("_", " ")} issue needs immediate inspection and action from ${draft.authority?.name}. #CivicLens #SafetyFirst`,
  };

  const emails: Record<Tone, string> = generatedOutreach
    ? {
        polite: generatedOutreach.emails?.polite || generatedOutreach.email,
        firm: generatedOutreach.emails?.firm || generatedOutreach.email,
        urgent: generatedOutreach.emails?.urgent || generatedOutreach.email,
      }
    : fallbackEmails;

  const socials: Record<Tone, string> = generatedOutreach
    ? {
        polite: generatedOutreach.socialPost,
        firm: generatedOutreach.socialPost,
        urgent: generatedOutreach.socialPost,
      }
    : fallbackSocials;

  const activeText =
    activeTab === "email" ? emails[emailTone] : socials[socialTone];
  const cleanActiveText = stripMarkdown(activeText);
  const cleanDetailedReport = generatedOutreach
    ? stripMarkdown(generatedOutreach.detailedReport)
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanActiveText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async () => {
    if (isUploading) return;

    setUploadError("");
    setIsUploading(true);

    const newCase: Partial<Report> = {
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || "local-user",
      photoUrl: draft.photoUrl!,
      faultType: (draft.faultType as FaultType) || "other",
      severity: (draft.severity as FaultSeverity) || "medium",
      description: draft.description || "",
      location: draft.location || {
        address: "Unknown",
        city: "Unknown",
        lat: 0,
        lng: 0,
      },
      authority: draft.authority || {
        name: "Unknown",
        department: "Unknown",
        email: "",
        phone: "",
        hours: "",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      followUpAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duplicateCount: 0,
      emailSent: false,
      socialPostPublished: false,
      timeline: [
        {
          id: Date.now().toString(),
          type: "filed",
          label: "Report Uploaded to CivicLens",
          date: new Date().toISOString(),
        },
      ],
    };

    const caseId = await addCase(newCase);

    if (caseId) {
      resetDraft();
      router.push(`/cases/${caseId}`);
    } else {
      setUploadError(
        "The report was analyzed but could not be saved. Please check that you are signed in and try again.",
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen pb-32 max-w-6xl mx-auto w-full md:pt-6 px-4 lg:px-8">
      <div className="flex items-center gap-4 w-full pt-4 pb-2 max-w-xl lg:max-w-none">
        <button
          onClick={() => router.push("/report/preview")}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-display font-semibold text-[20px] md:text-[24px]">
          Generated Outreach
        </h1>
      </div>

      <div className="w-full mt-2 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:items-start lg:gap-6">
        {generatedOutreach && (
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl p-4 md:p-5 mb-4 lg:mb-0 w-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  Issue Detected
                </p>
                <h2 className="font-display font-semibold text-[18px] text-white mt-1">
                  {aiAnalysis?.issueDetected || "Civic fault detected"}
                </h2>
              </div>
              {aiAnalysis?.severity && (
                <span className="rounded-full bg-[var(--color-danger-muted)] border border-[var(--color-danger)] px-3 py-1 text-[11px] font-bold uppercase text-[var(--color-danger)]">
                  {aiAnalysis.severity}
                </span>
              )}
            </div>

            <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mt-4 whitespace-pre-wrap">
              {cleanDetailedReport}
            </p>

            {generatedOutreach.immediateActionPlan.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Immediate Action Plan
                </p>
                <ul className="space-y-2">
                  {generatedOutreach.immediateActionPlan.map((action, index) => (
                    <li
                      key={`${action}-${index}`}
                      className="text-[13px] text-white leading-relaxed"
                    >
                      {index + 1}. {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {draft.authority && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Nearest Authority Office
                </p>
                <h3 className="text-[15px] font-semibold text-white">
                  {draft.authority.officeName || draft.authority.name}
                </h3>
                {draft.authority.officeAddress && (
                  <p className="text-[13px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    {draft.authority.officeAddress}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[var(--color-text-secondary)]">
                  <p>Email: {draft.authority.email || "Not found"}</p>
                  <p>Phone: {draft.authority.phone || "Not found"}</p>
                  <p>Hours: {draft.authority.hours || "Not listed"}</p>
                  {draft.authority.distanceKm !== undefined && (
                    <p>Distance: about {draft.authority.distanceKm} km</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-xl lg:max-w-none">
          <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] mb-4">
            Select a tone and copy the generated text to contact authorities
            yourself.
          </p>

          <div className="flex bg-[var(--color-bg-surface)] p-1 rounded-xl mb-4 w-full">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${activeTab === "email" ? "bg-[var(--color-accent)] text-[#0F1117]" : "text-[var(--color-text-secondary)] hover:text-white"}`}
              onClick={() => setActiveTab("email")}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${activeTab === "social" ? "bg-[var(--color-accent)] text-[#0F1117]" : "text-[var(--color-text-secondary)] hover:text-white"}`}
              onClick={() => setActiveTab("social")}
            >
              <MessageSquare className="w-4 h-4" /> Social Post
            </button>
          </div>

          <div className="flex gap-2 mb-4 w-full">
            {(["polite", "firm", "urgent"] as Tone[]).map((tone) => (
              <button
                key={tone}
                onClick={() =>
                  activeTab === "email" ? setEmailTone(tone) : setSocialTone(tone)
                }
                className={`flex-1 py-2 rounded-lg border text-[13px] font-medium capitalize transition-colors cursor-pointer ${
                  (activeTab === "email" ? emailTone : socialTone) === tone
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-gray-500"
                }`}
              >
                {tone}
              </button>
            ))}
          </div>

          <div className="relative bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl p-4 min-h-[260px] w-full">
            <p className="text-[14px] text-white whitespace-pre-wrap leading-relaxed pb-16">
              {cleanActiveText}
            </p>

            <button
              onClick={handleCopy}
              className="absolute bottom-4 right-4 bg-[var(--color-bg-elevated)] hover:bg-gray-700 text-white p-2.5 rounded-xl border border-[var(--color-border)] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
              ) : (
                <Copy className="w-5 h-5 text-[var(--color-text-muted)]" />
              )}
              <span className="text-[13px] font-medium">
                {copied ? "Copied!" : "Copy Text"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-xl bg-[var(--color-bg-base)]/95 backdrop-blur border-t border-[var(--color-border)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 z-40 md:rounded-t-[32px] md:border-l md:border-r">
        <Button
          size="lg"
          className="w-full shadow-[var(--shadow-button)] cursor-pointer"
          onClick={handleUpload}
          isLoading={isUploading}
        >
          Upload to Platform
        </Button>
        <p className="text-[12px] text-[var(--color-text-muted)] text-center mt-3">
          This will save your report to the CivicLens map.
        </p>
        {uploadError && (
          <p className="text-[12px] text-[var(--color-danger)] text-center mt-2 leading-relaxed">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}
