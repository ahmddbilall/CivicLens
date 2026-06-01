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
import { Report } from "@/types";

type Tone = "polite" | "firm" | "urgent";

export default function ReviewScreen() {
  const router = useRouter();
  const { draft, setDraft } = useReportStore();
  const { user } = useAuthStore();
  const { addCase } = useCasesStore();

  const [activeTab, setActiveTab] = useState<"email" | "social">("email");
  const [emailTone, setEmailTone] = useState<Tone>("firm");
  const [socialTone, setSocialTone] = useState<Tone>("urgent");
  const [copied, setCopied] = useState(false);

  if (!draft.photoUrl) return null;

  const emails = {
    polite: `Dear ${draft.authority?.name},\n\nI hope this email finds you well. I am writing to kindly bring to your attention an issue regarding ${draft.faultType?.replace("_", " ")} located at ${draft.location?.address}, ${draft.location?.city}.\n\nThe specific issue is: ${draft.description}.\n\nI would appreciate it if you could look into this when possible. A photo is attached for your reference.\n\nThank you,\n${user?.name || "CivicLens User"}`,
    firm: `To ${draft.authority?.name} Management,\n\nI am writing to formally report a ${draft.faultType?.replace("_", " ")} issue at ${draft.location?.address}, ${draft.location?.city}.\n\nDescription: ${draft.description}.\n\nThis requires attention as it impacts the local residents. Please review the attached photo and provide a timeline for resolution.\n\nRegards,\n${user?.name || "CivicLens User"}`,
    urgent: `URGENT: ${draft.authority?.name} Action Required,\n\nI am reporting a severe hazard regarding ${draft.faultType?.replace("_", " ")} at ${draft.location?.address}, ${draft.location?.city}.\n\nDetails: ${draft.description}.\n\nThis poses an immediate risk to public safety and must be addressed without delay. See attached evidence. Please confirm receipt and immediate action plan.\n\nSincerely,\n${user?.name || "CivicLens User"}`,
  };

  const socials = {
    polite: `Just reported a ${draft.faultType?.replace("_", " ")} issue at ${draft.location?.address}. Hoping @${draft.authority?.name?.replace(/ /g, "")} can look into this soon to help keep our city clean and safe! 🏙️ #CivicLens`,
    firm: `Attention @${draft.authority?.name?.replace(/ /g, "")}: There is a persistent ${draft.faultType?.replace("_", " ")} problem at ${draft.location?.address} that needs to be fixed. Local residents are waiting for action. 🚧 #CivicLens #FixOurCity`,
    urgent: `🚨 UNACCEPTABLE HAZARD at ${draft.location?.address}! The ${draft.faultType?.replace("_", " ")} is putting people at risk. @${draft.authority?.name?.replace(/ /g, "")} MUST address this IMMEDIATELY! Everyone please share to demand action! ⚠️ #CivicLens #SafetyFirst`,
  };

  const handleCopy = () => {
    const textToCopy =
      activeTab === "email" ? emails[emailTone] : socials[socialTone];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = () => {
    // Generate a full report object
    const newCase: Report = {
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      photoUrl: draft.photoUrl!,
      faultType: (draft.faultType as any) || "other",
      severity: (draft.severity as any) || "medium",
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

    addCase(newCase);
    // clear draft
    setDraft({
      photoUrl: undefined,
      description: undefined,
      sendEmail: false,
      postSocial: false,
    });
    router.push("/report/success");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen pb-32 max-w-xl mx-auto w-full md:pt-6 px-4 md:px-0 items-center">
      {/* Header */}
      <div className="flex items-center gap-4 w-full pt-4 pb-2">
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

      <div className="w-full mt-2">
        <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] mb-4">
          Select a tone and copy the generated text to contact authorities
          yourself.
        </p>

        {/* Tabs */}
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

        {/* Tone Selector */}
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

        {/* Text Area Output */}
        <div className="relative bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl p-4 min-h-[200px] w-full">
          <p className="text-[14px] text-white whitespace-pre-wrap leading-relaxed">
            {activeTab === "email" ? emails[emailTone] : socials[socialTone]}
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

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-xl bg-[var(--color-bg-base)]/95 backdrop-blur border-t border-[var(--color-border)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 z-40 md:rounded-t-[32px] md:border-l md:border-r">
        <Button
          size="lg"
          className="w-full shadow-[var(--shadow-button)] cursor-pointer"
          onClick={handleUpload}
        >
          Upload to Platform
        </Button>
        <p className="text-[12px] text-[var(--color-text-muted)] text-center mt-3">
          This will save your report to the CivicLens map.
        </p>
      </div>
    </div>
  );
}
