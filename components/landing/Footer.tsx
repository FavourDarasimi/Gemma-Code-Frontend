"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon } from "@/lib/icons";

const productLinks = [
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Changelog", href: "#" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-[1500px] mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
          {/* Brand */}
          <div className="md:w-72 shrink-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-white">
                <HugeiconsIcon icon={CodeIcon} size={16} />
              </div>
              <span
                className="text-lg font-[600] leading-6 text-ink"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                GemmaCode
              </span>
            </div>
            <p
              className="text-sm leading-5 text-muted max-w-[240px]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              AI-powered code assistant that helps you build, fix, and understand code faster.
            </p>
          </div>

          {/* Product */}
          <div className="flex-1">
            <span
              className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-5 block"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Product
            </span>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm leading-5 text-ink hover:text-muted transition-colors duration-100"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex-1">
            <span
              className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-5 block"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Legal
            </span>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm leading-5 text-ink hover:text-muted transition-colors duration-100"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex-1">
            <span
              className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-5 block"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Connect
            </span>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-5 text-ink hover:text-muted transition-colors duration-100"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-5 text-ink hover:text-muted transition-colors duration-100"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  Twitter / X
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line">
          <p
            className="text-sm leading-5 text-muted"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            &copy; {new Date().getFullYear()} GemmaCode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
