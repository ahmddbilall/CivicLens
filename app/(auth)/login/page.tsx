"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(120, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { startAuth, verifyOtp, clearAuthIntent } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };
  
  const onSubmit = async (data: FormData) => {
    startAuth({ email: data.email, intent: "login" });
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
        return;
      }
      
      clearAuthIntent();
      router.push("/home");
    } catch (error) {
      toast.error("An error occurred during sign in");
    }
  };

  return (
    <div className="flex flex-col h-full justify-center w-full max-w-md mx-auto px-6 py-12">
      <button
        onClick={() => router.back()}
        className="text-text-secondary self-start mb-6"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="text-center mb-10">
        <h2 className="font-display font-bold text-[18px]">CivicLens</h2>
        <h1 className="font-display font-semibold text-[26px] mt-8">
          Welcome back
        </h1>
        <p className="font-body text-[14px] text-text-secondary mt-1">
          Sign in with your email and password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1"
      >
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

        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
              className={errors.password ? "border-danger pr-12" : "pr-12"}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-danger mt-1 px-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <p className="text-[12px] text-text-muted text-center mt-1">
          Password must be at least 8 characters.
        </p>

        <div className="mt-auto pt-6 flex flex-col gap-6">
          <Button type="submit" size="lg" disabled={!isValid || isSubmitting}>
            Sign In &rarr;
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
            href="/signup"
            className="text-[14px] text-center text-text-secondary"
          >
            Don&apos;t have an account?{" "}
            <span className="text-accent font-medium">Sign Up</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
