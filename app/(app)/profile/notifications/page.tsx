"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  
  const preferences = user?.preferences || {
    pushNotifications: true,
    emailAlerts: true,
    language: "en"
  };

  const [prefs, setPrefs] = useState(preferences);

  useEffect(() => {
    if (user?.preferences) {
      setPrefs(user.preferences);
    }
  }, [user?.preferences]);

  const handleToggle = async (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs); // Optimistic update
    const success = await updateProfile({ preferences: newPrefs });
    if (success) {
      toast.success("Preferences updated");
    } else {
      setPrefs(prefs); // Rollback on failure
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-[80vh] bg-[var(--color-bg-base)] px-6 pt-4 pb-8 w-full max-w-xl mx-auto md:mt-8">
      <div className="flex items-center gap-4 mb-4 mt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-display font-semibold text-[24px]">Notification Preferences</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-medium text-[16px]">Push Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[var(--color-text-secondary)]">Case Updates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={prefs.pushNotifications} 
                  onChange={() => handleToggle('pushNotifications')}
                />
                <div className="w-11 h-6 bg-[var(--color-bg-elevated)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[var(--color-text-secondary)]">Nearby Faults</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--color-bg-elevated)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-medium text-[16px]">Email Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[var(--color-text-secondary)]">Resolution Summaries</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={prefs.emailAlerts}
                  onChange={() => handleToggle('emailAlerts')}
                />
                <div className="w-11 h-6 bg-[var(--color-bg-elevated)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
