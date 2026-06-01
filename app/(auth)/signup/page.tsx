"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(80, "Name is too long")
    .regex(
      /^[a-zA-Z\s.'-]+$/,
      "Name can only include letters and common separators",
    ),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(120, "Email is too long"),
});

type FormData = z.infer<typeof schema>;
type PolicyModal = "terms" | "privacy" | null;

export default function SignupScreen() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<PolicyModal>(null);
  const { startAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    startAuth({ email: data.email, name: data.fullName, intent: "signup" });
    // OTP is sent to email in the real integration.
    router.push("/verify");
  };

  const handleGoogleSignIn = () => {
    startAuth({
      email: "google.user@civiclens.app",
      name: "Google User",
      intent: "signup",
    });
    router.push("/verify");
  };

  return (
    <div className="flex flex-col h-full justify-center w-full max-w-md mx-auto px-6 py-12">
      <button
        onClick={() => router.back()}
        className="text-text-secondary self-start mb-6"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-[18px]">CivicLens</h2>
        <h1 className="font-display font-semibold text-[26px] mt-8">
          Create your account
        </h1>
        <p className="font-body text-[14px] text-text-secondary mt-1">
          Sign up with email or Google.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1"
      >
        <div>
          <Input
            label="Full Name"
            icon={<User className="w-5 h-5" />}
            autoComplete="name"
            className={errors.fullName ? "border-danger" : ""}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-[12px] text-danger mt-1 px-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            className={errors.email ? "border-danger" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[12px] text-danger mt-1 px-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <p className="text-[12px] text-text-muted text-center mt-2">
          By signing up, you agree to our{" "}
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            className="text-accent underline hover:no-underline cursor-pointer"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="text-accent underline hover:no-underline cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </p>

        <p className="text-[12px] text-text-muted text-center -mt-1">
          We&apos;ll send a 6-digit verification code to your email.
        </p>

        <div className="mt-auto pt-6 flex flex-col gap-6">
          <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
            Continue with Email &rarr;
          </Button>

          <div className="flex items-center gap-4">
            <hr className="flex-1 border-border" />
            <span className="text-[14px] text-text-secondary">or</span>
            <hr className="flex-1 border-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="h-12 bg-bg-surface border border-border rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-bg-elevated transition-colors cursor-pointer"
          >
            <span className="font-bold text-lg">G</span> Continue with Google
          </button>

          <Link
            href="/login"
            className="text-[14px] text-center text-text-secondary"
          >
            Already have an account?{" "}
            <span className="text-accent font-medium">Sign In</span>
          </Link>
        </div>
      </form>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
          <div className="w-full max-w-lg bg-bg-surface border border-border rounded-2xl p-5 max-h-[80vh] overflow-y-auto">
            <h2 className="font-display font-semibold text-[22px] text-white">
              {activeModal === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h2>

            {activeModal === "terms" ? (
              <div className="mt-4 text-[14px] text-text-secondary leading-relaxed space-y-3">
                <p>
                  By creating an account, you agree to use CivicLens only for
                  lawful civic reporting.
                </p>
                <p>
                  You are responsible for ensuring that your reports are
                  accurate and submitted in good faith.
                </p>
                <p>
                  CivicLens may update or discontinue features as the platform
                  evolves.
                </p>
                <p>
                  Automated assistance is provided for convenience and should be
                  reviewed by you before sharing externally.
                </p>
              </div>
            ) : (
              <div className="mt-4 text-[14px] text-text-secondary leading-relaxed space-y-3">
                <p>
                  We collect information needed to create and manage your
                  reports, such as name, email, location details, and report
                  content.
                </p>
                <p>
                  We do not sell your personal data. Information is used to
                  power report workflows and case tracking.
                </p>
                <p>
                  Report data may be shared only with relevant authorities to
                  help route civic complaints.
                </p>
                <p>
                  You can request account updates and control profile details
                  inside the app settings.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
