"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Globe2, ShieldCheck, FileText, Code2 } from "lucide-react";

export default function AboutScreen() {
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
        <h1 className="font-display font-semibold text-[24px]">About</h1>
      </div>

      <div className="flex flex-col items-center text-center mt-6 mb-8">
        <div className="w-20 h-20 bg-[var(--color-accent)] rounded-3xl flex items-center justify-center rotate-3 shadow-[var(--color-accent)] shadow-lg mb-4">
          <svg
            className="w-10 h-10 text-[var(--color-bg-base)] -rotate-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
            <circle cx="12" cy="13" r="3"></circle>
          </svg>
        </div>
        <h2 className="font-display font-bold text-[30px] text-white">
          CivicLens
        </h2>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 max-w-lg">
          A civic reporting app that helps residents document city issues, route
          them to the right authority, and keep track of what happens next.
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-[16px] text-white">
              What CivicLens does
            </h3>
          </div>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
            CivicLens lets people report road damage, garbage, broken lights,
            and other public issues in a few taps. The app organizes each
            report, helps generate follow-up messages, and keeps a clear record
            of case progress.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-[16px] text-white">
              Why it exists
            </h3>
          </div>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
            Public issues often go unreported or disappear into long complaint
            channels. CivicLens gives citizens a simple, visual, and accountable
            way to raise problems and push for action.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-[16px] text-white">Built with</h3>
          </div>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
            CivicLens combines a modern mobile-first interface with lightweight
            automation to classify reports, draft outreach copy, and manage case
            updates in a way that feels fast and approachable.
          </p>
        </section>
      </div>

      <div className="space-y-4 mb-6">
        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <h3 className="font-semibold text-[16px] text-white mb-2">
            Terms of Service
          </h3>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
            By using CivicLens, you agree to use the app for lawful civic
            reporting and to provide accurate information when submitting a
            report. CivicLens may use your submitted data to process cases,
            generate follow-up actions, and improve the service.
          </p>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mt-3">
            CivicLens is provided as a community tool and may change features,
            availability, or supported authorities over time.
          </p>
        </section>

        <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <h3 className="font-semibold text-[16px] text-white mb-2">
            Open Source Licenses
          </h3>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
            CivicLens uses open source software and design resources where
            appropriate. Third-party libraries retain their original licenses
            and attribution requirements. If you plan to redistribute the app,
            review the upstream license terms for each dependency and asset.
          </p>
        </section>
      </div>
    </div>
  );
}
