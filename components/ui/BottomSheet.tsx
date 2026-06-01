"use client";

import * as React from "react";
import { Drawer } from "vaul";

export function BottomSheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        {/* Rendered by parent */}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Drawer.Content className="bg-[var(--color-bg-surface)] flex flex-col rounded-t-3xl border-t border-[var(--color-border)] fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] outline-none">
          <div className="p-4 bg-[var(--color-bg-surface)] rounded-t-3xl flex-1 overflow-y-auto">
            <div className="mx-auto w-10 h-1 bg-[var(--color-border)] rounded-full mb-5" />
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
