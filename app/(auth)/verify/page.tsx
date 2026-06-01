"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function VerifyScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(48);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { user, verifyOtp, authIntent, clearAuthIntent } = useAuthStore();

  useEffect(() => {
    if (!user?.email) {
      router.replace("/login");
    }
  }, [router, user?.email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const nextOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, idx) => {
      nextOtp[idx] = char;
    });
    setOtp(nextOtp);
    setError("");
    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the complete 6-digit code.");
      return;
    }
    setSuccess(true);
    verifyOtp(code);
    setTimeout(() => {
      if (authIntent === "signup") {
        router.push("/setup");
      } else {
        clearAuthIntent();
        router.push("/home");
      }
    }, 1500);
  };

  const handleResend = () => {
    setTimer(48);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== "");

  // Auto-submit
  useEffect(() => {
    if (isComplete && !success) {
      const t = setTimeout(handleVerify, 300);
      return () => clearTimeout(t);
    }
  }, [isComplete, success]);

  return (
    <div className="flex flex-col items-center h-full justify-center w-full max-w-md mx-auto px-6 py-12 relative">
      <button
        onClick={() => router.back()}
        className="text-[var(--color-text-secondary)] absolute left-6 top-12"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {success ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-24 h-24 bg-[var(--color-success-muted)] border border-[var(--color-success)] rounded-full flex items-center justify-center mt-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-12 h-12 text-[var(--color-success)]" />
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="w-16 h-16 bg-[var(--color-accent-muted)] rounded-full flex items-center justify-center mx-auto mt-6">
            <Lock className="w-8 h-8 text-[var(--color-accent)]" />
          </div>

          <h1 className="font-display font-semibold text-[24px] text-center mt-6">
            Verify your email
          </h1>
          <p className="font-body text-[14px] text-center text-[var(--color-text-secondary)] mt-2">
            We sent a 6-digit code to{" "}
            <span className="font-bold text-white">
              {user?.email || "you@example.com"}
            </span>
          </p>

          <div className="flex justify-between w-full mt-10 max-w-[320px]">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-14 text-center text-xl font-mono bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-muted)] transition-all text-white"
              />
            ))}
          </div>

          {error && (
            <p className="text-[12px] text-[var(--color-danger)] mt-3">
              {error}
            </p>
          )}

          <p className="text-[14px] text-[var(--color-text-secondary)] mt-8">
            {timer > 0 ? (
              <span>
                Resend code in{" "}
                <span className="font-bold text-white">
                  0:{timer.toString().padStart(2, "0")}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[var(--color-accent)] font-medium hover:underline cursor-pointer"
              >
                Resend code
              </button>
            )}
          </p>

          <div className="mt-auto pt-6 w-full max-w-[320px]">
            <Button
              className="w-full"
              size="lg"
              disabled={!isComplete}
              onClick={handleVerify}
            >
              Verify
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
