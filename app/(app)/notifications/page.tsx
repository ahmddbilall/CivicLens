"use client";

import { useState } from "react";
import { Bell, Check, AlertTriangle, Hash } from "lucide-react";

import { useCasesStore } from "@/store/useCasesStore";

export default function NotificationsScreen() {
  const { cases } = useCasesStore();
  const [readState, setReadState] = useState<Record<string, boolean>>({});
  
  // Derive notifications from cases timeline
  const notifications = cases.flatMap(c => 
    c.timeline?.map(t => ({
      id: `${c.id}-${t.id}`,
      type: t.type === "filed" ? "new_case" : t.type === "email_sent" ? "follow_up" : "resolved",
      title: t.label,
      body: `Case ${c.id}: ${c.description || "Report updated."}`,
      time: new Date(t.date).toLocaleDateString() + " " + new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      group: "Recent",
      read: readState[`${c.id}-${t.id}`] || false,
    })) || []
  ).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case "follow_up":
        return (
          <div className="w-10 h-10 bg-[#3B82F615] rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-[#3B82F6]" />
          </div>
        );
      case "resolved":
        return (
          <div className="w-10 h-10 bg-[#10B98115] rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-[#10B981]" />
          </div>
        );
      case "escalated":
        return (
          <div className="w-10 h-10 bg-[#DC262615] rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
          </div>
        );
      case "new_case":
        return (
          <div className="w-10 h-10 bg-[#F5A62315] rounded-full flex items-center justify-center shrink-0">
            <Hash className="w-5 h-5 text-[#F5A623]" />
          </div>
        );
      default:
        return null;
    }
  };

  const groups = ["Today", "Yesterday", "Earlier"];

  const handleMarkAllAsRead = () => {
    const newReadState = { ...readState };
    notifications.forEach(n => {
      newReadState[n.id] = true;
    });
    setReadState(newReadState);
  };

  return (
    <div className="flex flex-col pb-6 md:px-6 lg:px-10 max-w-3xl mx-auto w-full md:mt-4">
      <div className="px-4 md:px-0 pt-4 md:pt-0 flex justify-between items-center mb-6">
        <h1 className="font-display font-semibold text-[24px] md:text-[28px]">
          Notifications
        </h1>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="text-[var(--color-accent)] font-medium hover:underline disabled:opacity-50"
          disabled={notifications.every((notification) => notification.read)}
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-[var(--color-bg-surface)] rounded-none md:rounded-2xl md:border md:border-[var(--color-border)] overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Bell className="w-12 h-12 text-[var(--color-text-muted)] mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-1">No notifications yet</h3>
            <p className="text-[var(--color-text-secondary)] text-sm max-w-xs">When there are updates on your reports, they will appear here.</p>
          </div>
        ) : (
          ["Recent"].map((group, idx) => {
            const groupItems = notifications.filter((n) => n.group === group);
            if (groupItems.length === 0) return null;

            return (
              <div
                key={group}
                className={
                  idx !== 0 ? "border-t border-[var(--color-border)]" : ""
                }
              >
                <h3 className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider px-4 md:px-6 mb-2 mt-4 font-bold">
                  {group}
                </h3>
                <div className="flex flex-col">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className={`px-4 md:px-6 py-4 flex gap-4 items-start transition-colors hover:bg-[var(--color-bg-elevated)] cursor-pointer ${
                        !item.read
                          ? "bg-[var(--color-bg-elevated)]/50 border-l-2 border-l-[var(--color-accent)] md:pl-[22px] pl-[14px]"
                          : "border-b border-[var(--color-border)] last:border-0"
                      }`}
                      onClick={() =>
                        setReadState((current) => ({
                          ...current,
                          [item.id]: true
                        }))
                      }
                    >
                      {getIcon(item.type)}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-body font-medium text-[14px] md:text-[15px] text-white leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[13px] md:text-[14px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                          {item.body}
                        </p>
                        <p className="text-[11px] md:text-[12px] text-[var(--color-text-muted)] mt-1.5">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
