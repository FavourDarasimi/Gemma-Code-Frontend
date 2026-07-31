"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
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
        <input
          ref={ref}
          id={fieldId}
          className={`w-full rounded-[6px] border bg-surface px-3 py-2.5 text-[15px] leading-6 text-ink placeholder:text-muted outline-none transition-colors duration-150 ease-out ${
            error
              ? "border-danger"
              : "border-line focus:border-accent focus:shadow-[var(--ring-accent)]"
          } ${className}`}
          style={{ fontFamily: "var(--font-geist-sans)" }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
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

TextField.displayName = "TextField";
