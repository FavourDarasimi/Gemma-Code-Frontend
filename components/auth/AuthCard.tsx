"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon } from "@/lib/icons";

interface AuthCardProps {
  heading: string;
  children: ReactNode;
  footer: ReactNode;
  serverError?: string | null;
}

export function AuthCard({ heading, children, footer, serverError }: AuthCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 mb-8"
        aria-label="GemmaCode home"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-accent text-white">
          <HugeiconsIcon icon={CodeIcon} size={18} />
        </div>
        <span
          className="text-lg font-[600] leading-6 text-ink"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          GemmaCode
        </span>
      </Link>

      <div
        className="w-full max-w-[400px] rounded-[6px] border border-line bg-surface p-8"
        style={{ boxShadow: "0 4px 16px rgba(20,22,26,0.08)" }}
      >
        <h1
          className="text-[24px] font-[600] leading-8 text-ink mb-6"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {heading}
        </h1>

        {serverError && (
          <div
            className="mb-4 px-4 py-3 rounded-[6px] border border-danger text-sm leading-5"
            style={{ backgroundColor: "#FBEEEC", fontFamily: "var(--font-geist-mono)" }}
            role="alert"
          >
            {serverError}
          </div>
        )}

        {children}
      </div>

      <p
        className="mt-6 text-sm leading-5 text-muted"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        {footer}
      </p>
    </div>
  );
}
