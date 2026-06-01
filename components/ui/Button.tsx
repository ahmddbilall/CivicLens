import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-[var(--color-accent)] text-[var(--color-bg-base)] font-semibold shadow-[var(--shadow-button)] hover:bg-[var(--color-accent-hover)] active:scale-[0.97] transition-transform",
      secondary:
        "bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-white hover:bg-[var(--color-bg-elevated)]",
      ghost:
        "bg-transparent text-[var(--color-text-secondary)] underline hover:text-white",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-full",
      md: "h-11 px-6 text-base rounded-full",
      lg: "h-14 px-8 text-lg rounded-full w-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
