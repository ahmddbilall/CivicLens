"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AgentPipeline } from "@/components/features/report/AgentPipeline";
import { useReportStore } from "@/store/useReportStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { FaultSeverity, FaultType } from "@/types";

type VisionOutput = {
  faultType: FaultType;
  severity: FaultSeverity;
  issueDetected: string;
  refinedDescription: string;
  visualEvidence: string[];
  immediateActions: string[];
  publicSafetyRisk: string;
  confidence: number;
};

type ContextOutput = {
  lat: number;
  lng: number;
  accuracy: number;
  street: string;
  area: string;
  address: string;
  city: string;
  displayName: string;
};

type AuthorityOutput = {
  authority: {
    name: string;
    department: string;
    email: string;
    phone: string;
    hours: string;
    officeName?: string;
    officeAddress?: string;
    officeLocation?: {
      lat?: number;
      lng?: number;
    };
    distanceKm?: number;
    sourceUrl?: string;
  };
  reasoning: string;
  sources?: Array<{ title: string; url: string }>;
};

type CommunicationsOutput = {
  detailedReport: string;
  emails?: {
    polite: string;
    firm: string;
    urgent: string;
  };
  email: string;
  socialPost: string;
  immediateActionPlan: string[];
};

async function postAgent<T>(body: unknown): Promise<T> {
  const res = await fetch("/api/ai/report-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "AI agent request failed");
  }

  return data;
}

async function reverseGeocode(lat: number, lon: number) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  const res = await fetch(`/api/location/reverse?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Reverse geocoding failed");
  }

  return data as {
    street: string;
    area: string;
    city: string;
    state: string;
    postcode: string;
    displayName: string;
  };
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not available in this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export default function ProcessingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { draft, setDraft } = useReportStore();
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const visionRef = useRef<VisionOutput | null>(null);
  const contextRef = useRef<ContextOutput | null>(null);
  const authorityRef = useRef<AuthorityOutput | null>(null);
  const communicationsRef = useRef<CommunicationsOutput | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!draft.photoUrl) {
      router.replace("/report");
    }
  }, [draft.photoUrl, router]);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    const vision = visionRef.current;
    const context = contextRef.current;
    const authority = authorityRef.current;
    const communications = communicationsRef.current;

    setDraft({
      faultType: vision?.faultType || "other",
      severity: vision?.severity || "medium",
      description:
        vision?.refinedDescription ||
        draft.description ||
        "Reported civic issue",
      location: {
        lat: context?.lat || 0,
        lng: context?.lng || 0,
        address:
          context?.address ||
          user?.street ||
          "Location captured from report context",
        city: context?.city || user?.city || "Unknown City",
      },
      authority: authority?.authority || {
        name: "Local Authority",
        department: "Public Works",
        email: "",
        phone: "",
        hours: "",
        officeName: "",
        officeAddress: "",
        officeLocation: undefined,
        distanceKm: undefined,
        sourceUrl: "",
      },
      aiAnalysis: vision || undefined,
      generatedOutreach: communications || undefined,
    });
  }, [draft.description, setDraft, user?.city, user?.street]);

  const runAgentStep = useCallback(
    async (stepId: string) => {
      if (stepId === "vision") {
        const vision = await postAgent<VisionOutput>({
          stage: "vision",
          imageDataUrl: draft.photoUrl,
          userDescription: draft.description,
        });
        visionRef.current = vision;
        return {
          result: `${vision.issueDetected} - Severity: ${vision.severity.toUpperCase()}`,
          detail: vision.publicSafetyRisk,
        };
      }

      if (stepId === "context") {
        let position: GeolocationPosition | null = null;
        let reverse: Awaited<ReturnType<typeof reverseGeocode>> | null = null;

        try {
          position = await getCurrentPosition();
          reverse = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
        } catch (error) {
          reverse = null;
        }

        const profileAddress = [user?.street, user?.area]
          .filter(Boolean)
          .join(", ");
        const resolvedAddress =
          [reverse?.street, reverse?.area].filter(Boolean).join(", ") ||
          profileAddress ||
          reverse?.displayName ||
          "Location captured from device";
        const context: ContextOutput = {
          lat: position?.coords.latitude || 0,
          lng: position?.coords.longitude || 0,
          accuracy: position?.coords.accuracy || 0,
          street: reverse?.street || user?.street || "",
          area: reverse?.area || user?.area || "",
          address: resolvedAddress,
          city: reverse?.city || user?.city || "Unknown City",
          displayName: reverse?.displayName || resolvedAddress,
        };
        contextRef.current = context;
        return {
          result: context.address,
          detail: position
            ? `${context.city} - accuracy about ${Math.round(context.accuracy)}m`
            : `${context.city} - using profile/location fallback`,
        };
      }

      if (stepId === "authority") {
        const authority = await postAgent<AuthorityOutput>({
          stage: "authority",
          context: {
            vision: visionRef.current,
            location: contextRef.current,
            userProfile: {
              city: user?.city,
              street: user?.street,
              area: user?.area,
            },
          },
        });
        authorityRef.current = authority;
        return {
          result:
            authority.authority.officeName ||
            authority.authority.name ||
            "Authority selected",
          detail:
            authority.authority.officeAddress ||
            authority.authority.department ||
            authority.reasoning,
        };
      }

      if (stepId === "comms") {
        const communications = await postAgent<CommunicationsOutput>({
          stage: "communications",
          context: {
            vision: visionRef.current,
            location: contextRef.current,
            authority: authorityRef.current,
            userDescription: draft.description,
            userName: user?.name,
          },
        });
        communicationsRef.current = communications;
        return {
          result: "Detailed report generated",
          detail: "Email, action plan, and social post ready",
        };
      }

      return {
        result: "Case tracking prepared",
        detail: "Auto follow-up in 7 days if unresolved",
      };
    },
    [draft.description, draft.photoUrl, user],
  );

  if (!mounted || !draft.photoUrl) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen h-full justify-center items-center bg-[var(--color-bg-base)] px-5 pt-6 pb-8 relative w-full max-w-md mx-auto">
      {/* Progress Bar (absolute top) */}
      <div className="fixed md:absolute top-0 left-0 right-0 h-1 bg-[var(--color-border)] z-50">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="h-full bg-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col items-center text-center mt-2 md:mt-0 mb-6 w-full">
        <img
          src={draft.photoUrl}
          alt="Thumbnail"
          className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl object-cover border-2 border-[var(--color-border)] shadow-lg"
        />
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] text-center mt-3 font-medium">
          Analyzing your report...
        </p>
      </div>

      <div className="w-full">
        <AgentPipeline onComplete={handleComplete} runStep={runAgentStep} />
      </div>

      {/* Bottom CTA Slides up */}
      {isComplete && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-[var(--color-bg-base)]/90 backdrop-blur border-t border-[var(--color-border)] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 z-40 md:rounded-t-3xl md:border-l md:border-r"
        >
          <Button
            size="lg"
            className="w-full shadow-[var(--shadow-button)]"
            onClick={() => router.push("/report/review")}
          >
            Review &amp; Send &rarr;
          </Button>
        </motion.div>
      )}
    </div>
  );
}
