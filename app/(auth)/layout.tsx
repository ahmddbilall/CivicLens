import React from "react";
import { Camera } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-[var(--color-bg-base)]">
      {/* Desktop Left Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#1B3A6B] to-[#161D2F] items-center justify-center p-12 overflow-hidden">
        {/* Abstract background grid */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.5 0h1v60h-1V0zM0 29.5h60v1H0v-1z' fill='%23FFFFFF' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Mockup decoration */}
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-[var(--color-bg-surface)]/20 backdrop-blur-md border border-white/10 rounded-[32px] p-8 shadow-2xl">
            <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Camera className="w-8 h-8 text-[#0F1117]" />
            </div>
            <h1 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
              Report civic faults in seconds.
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              Snap a photo, let AI handle the heavy lifting, and keep your local authorities accountable.
            </p>
          </div>
        </div>

        {/* Floating circles decoration */}
        <div className="absolute top-[10%] right-[10%] w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[20%] w-48 h-48 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen" />
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex flex-col max-w-xl w-full mx-auto justify-center">
        {children}
      </div>
    </div>
  );
}
