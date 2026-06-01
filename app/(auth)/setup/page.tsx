"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, ChevronDown, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

const schema = z.object({
  street: z.string().min(2, "Street is required"),
  area: z.string().min(2, "Area is required"),
  zip: z.string().optional(),
  city: z.string().min(2, "City is required"),
});

type FormData = z.infer<typeof schema>;

export default function SetupScreen() {
  const router = useRouter();
  const { updateProfile, clearAuthIntent } = useAuthStore();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    updateProfile({
      street: data.street,
      area: data.area,
      zip: data.zip,
      city: data.city,
      avatarUrl: photoUrl || undefined,
    });
    clearAuthIntent();
    router.push("/home");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center w-full max-w-md mx-auto px-6 py-12 relative">
      {/* Progress */}
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
      </div>

      <h1 className="font-display font-semibold text-[24px]">
        Complete your profile
      </h1>
      <p className="font-body text-[14px] text-[var(--color-text-secondary)] mt-1 mb-8">
        Helps us auto-fill your complaints.
      </p>

      {/* Profile Photo */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="w-full h-full bg-[var(--color-bg-elevated)] border-2 border-dashed border-[var(--color-border)] rounded-full flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-[var(--color-text-muted)]" />
          )}
        </div>
        <label className="absolute bottom-0 right-0 w-7 h-7 bg-[var(--color-accent)] rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-[var(--color-bg-base)] text-[var(--color-bg-base)] font-bold">
          +
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1"
      >
        <Input
          label="Street / House No."
          icon={<MapPin className="w-5 h-5" />}
          {...register("street")}
        />
        <Input
          label="Area / Society"
          icon={<MapPin className="w-5 h-5" />}
          {...register("area")}
        />
        <Input
          label="ZIP Code (Optional)"
          icon={<MapPin className="w-5 h-5" />}
          {...register("zip")}
        />

        {/* Custom Select for City */}
        <div className="relative w-full h-[56px]">
          <select
            className="peer w-full h-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-border-focus)] transition-colors px-4 pt-4 pb-1 text-white appearance-none"
            {...register("city")}
            defaultValue=""
          >
            <option value="" disabled hidden></option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
          <label className="absolute left-4 top-4 text-sm text-[var(--color-text-secondary)] transition-all pointer-events-none peer-focus:top-3 peer-focus:-translate-y-1/2 peer-focus:text-xs">
            City / District
          </label>
        </div>

        <div className="bg-[var(--color-accent-muted)] border border-[var(--color-accent)] border-opacity-30 rounded-xl p-4 mt-2 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
          <p className="text-[14px] text-[var(--color-accent)] leading-tight">
            Your contact info only auto-fills complaints. Never shared publicly.
          </p>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <Button type="submit" size="lg" disabled={!isValid}>
            Finish Setup &rarr;
          </Button>
          <button
            type="button"
            onClick={() => {
              clearAuthIntent();
              router.push("/home");
            }}
            className="text-[14px] text-[var(--color-text-muted)] text-center underline hover:text-[var(--color-text-secondary)]"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}
