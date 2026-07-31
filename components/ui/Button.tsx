"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "px-3 py-1.5 text-xs leading-5",
  md: "px-5 py-2.5 text-sm leading-5",
  lg: "px-7 py-3 text-[15px] leading-5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-[500] transition-[background-color,border-color,color,transform] duration-150 ease-out cursor-pointer disabled:cursor-not-allowed select-none";

const variants = {
  primary:
    "bg-ink text-paper hover:bg-ink/80 active:scale-[0.97] disabled:bg-line disabled:text-muted disabled:active:scale-100 disabled:pointer-events-none",
  ghost:
    "bg-transparent border border-line text-ink hover:bg-paper active:scale-[0.97] disabled:text-muted disabled:active:scale-100 disabled:pointer-events-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
