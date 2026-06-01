import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, ...props }, ref) => {
    return (
      <div className="relative w-full h-[56px]">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "peer w-full h-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-border-focus)] transition-colors px-4 pt-4 pb-1 text-white placeholder-transparent",
            icon && "pl-11",
            className
          )}
          placeholder={label}
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 top-3 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:-translate-y-1/2 peer-focus:text-xs",
            icon && "peer-placeholder-shown:left-11"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
