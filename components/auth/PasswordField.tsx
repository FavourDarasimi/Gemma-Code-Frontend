"use client";

import { useState, type InputHTMLAttributes, forwardRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@/lib/icons";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={fieldId}
          className="block text-[13px] font-[500] leading-[18px] text-ink"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={visible ? "text" : "password"}
            className={`w-full rounded-[6px] border bg-surface px-3 py-2.5 pr-10 text-[15px] leading-6 text-ink placeholder:text-muted outline-none transition-colors duration-100 ${
              error
                ? "border-danger"
                : "border-line focus:border-accent focus:shadow-[0_0_0_3px_rgba(49,93,255,0.12)]"
            } ${className}`}
            style={{ fontFamily: "var(--font-geist-sans)" }}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-muted hover:text-ink rounded-[6px] transition-colors duration-100"
          >
            <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} size={18} />
          </button>
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-xs font-[500] leading-4 text-danger"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
