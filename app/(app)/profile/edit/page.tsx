"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, User, Phone, Mail, MapPin, ChevronDown, Hash, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  street: z.string().min(2, "Street is required"),
  area: z.string().min(2, "Area is required"),
  zip: z.string().optional(),
  city: z.string().min(2, "City is required"),
});

type FormData = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.avatarUrl || null);

  const { register, handleSubmit, formState: { isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      street: user?.street || "",
      area: user?.area || "",
      zip: user?.zip || "",
      city: user?.city || "",
    },
    mode: "onChange"
  });

  const onSubmit = (data: FormData) => {
    updateProfile({ ...data, avatarUrl: photoUrl || undefined });
    toast.success("Profile updated successfully", {
      style: {
        background: 'var(--color-bg-surface)',
        color: 'var(--color-success)',
        border: '1px solid var(--color-border)',
      },
      icon: '✓',
    });
    router.back();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-[80vh] bg-[var(--color-bg-base)] px-6 pt-4 pb-8 w-full max-w-xl mx-auto md:mt-8">
      <div className="flex items-center gap-4 mb-4 mt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-display font-semibold text-[24px]">Edit Profile</h1>
      </div>

      {/* Profile Photo */}
      <div className="relative w-24 h-24 mx-auto mb-8 mt-4">
        <div className="w-full h-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-border)] rounded-full flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-[var(--color-text-muted)]" />
          )}
        </div>
        <label className="absolute bottom-0 right-0 w-7 h-7 bg-[var(--color-accent)] rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-[var(--color-bg-base)] text-[var(--color-bg-base)] font-bold">
          <Camera className="w-3.5 h-3.5" />
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1">
        <Input label="Full Name" icon={<User className="w-5 h-5" />} {...register("name")} />
        <Input label="Phone Number" type="tel" icon={<Phone className="w-5 h-5" />} {...register("phone")} />
        <Input label="Email Address" type="email" icon={<Mail className="w-5 h-5" />} {...register("email")} />
        
        <div className="border-t border-[var(--color-border)] mt-2 pt-6 mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">Address Details</h3>
          <div className="flex flex-col gap-4">
            <Input label="Street / House No." icon={<MapPin className="w-5 h-5" />} {...register("street")} />
            <Input label="Area / Society" icon={<MapPin className="w-5 h-5" />} {...register("area")} />
            <Input label="ZIP / Postal Code" icon={<Hash className="w-5 h-5" />} {...register("zip")} />
            
            {/* Custom Select for City */}
            <div className="relative w-full h-[56px]">
              <select 
                className="peer w-full h-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-border-focus)] transition-colors px-4 pt-4 pb-1 text-white appearance-none"
                {...register("city")}
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
              <label className="absolute left-4 top-3 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] transition-all pointer-events-none">
                City / District
              </label>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button type="submit" size="lg" className="w-full" disabled={!isDirty && photoUrl === user?.avatarUrl}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
