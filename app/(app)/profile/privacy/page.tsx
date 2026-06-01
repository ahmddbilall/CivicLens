"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, LockKeyhole, Database, Brain } from "lucide-react";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-[80vh] bg-[var(--color-bg-base)] px-6 pt-4 pb-8 w-full max-w-2xl mx-auto md:mt-8">
      <div className="flex items-center gap-4 mb-4 mt-2">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-display font-semibold text-[24px]">
          Privacy Policy
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-6 bg-[var(--color-bg-surface)] p-4 rounded-xl border border-[var(--color-border)]">
        <Shield className="w-8 h-8 text-[var(--color-success)] shrink-0" />
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          We keep the policy simple: collect only what is needed to file and
          follow a report, protect it responsibly, and never sell your data.
        </p>
      </div>

      <div className="grid gap-4 text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <LockKeyhole className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-white font-medium text-[16px]">
              1. What we collect
            </h2>
          </div>
          <p>
            When you submit a report, CivicLens stores the photo, fault details,
            location information, and any contact details you choose to provide
            so the case can be processed.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-white font-medium text-[16px]">
              2. How we use it
            </h2>
          </div>
          <p>
            We use your information to map the issue, generate case records,
            draft outreach, and provide status updates. We do not use your data
            for unrelated advertising.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-white font-medium text-[16px]">
              3. AI processing
            </h2>
          </div>
          <p>
            Uploaded images may be processed by automated tools to classify the
            fault and extract useful case details. We keep this processing
            limited to the report workflow.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <h2 className="text-white font-medium text-[16px] mb-2">
            4. Sharing and control
          </h2>
          <p>
            We only share the report data needed to route the issue to the
            responsible authority. You can also remove or reset local draft data
            from the app when you no longer need it.
          </p>
        </section>
      </div>
    </div>
  );
}
