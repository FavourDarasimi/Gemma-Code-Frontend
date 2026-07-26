"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[6px] text-sm font-[500] leading-5 transition-colors duration-100 cursor-pointer disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-ink disabled:bg-line disabled:text-muted disabled:pointer-events-none",
  ghost:
    "bg-transparent border border-line text-ink hover:bg-paper disabled:text-muted disabled:pointer-events-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
